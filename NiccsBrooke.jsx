import { useState, useEffect } from "react";

const glitch = `
@keyframes glitch {
  0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0); }
  20% { clip-path: inset(33% 0 50% 0); transform: translate(-2px, 1px); }
  40% { clip-path: inset(60% 0 20% 0); transform: translate(2px, -1px); }
  60% { clip-path: inset(80% 0 5% 0); transform: translate(-1px, 2px); }
  80% { clip-path: inset(10% 0 75% 0); transform: translate(1px, -2px); }
}
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
@keyframes flicker {
  0%, 100% { opacity: 1; }
  92% { opacity: 1; }
  93% { opacity: 0.4; }
  94% { opacity: 1; }
  96% { opacity: 0.6; }
  97% { opacity: 1; }
}
@keyframes pulse-border {
  0%, 100% { box-shadow: 0 0 0px #e8547a44; }
  50% { box-shadow: 0 0 18px #e8547a55, inset 0 0 10px #e8547a11; }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes draw-line {
  from { width: 0; }
  to { width: 100%; }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
@keyframes stamp-in {
  0% { opacity: 0; transform: scale(1.5) rotate(-8deg); }
  60% { opacity: 1; transform: scale(0.95) rotate(-8deg); }
  100% { opacity: 1; transform: scale(1) rotate(-8deg); }
}
`;

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #07070d; }

  .dossier {
    background: #07070d;
    color: #c9c9d4;
    font-family: 'Share Tech Mono', 'Courier New', monospace;
    min-height: 100vh;
    padding: 32px 20px;
    position: relative;
    overflow: hidden;
    animation: flicker 8s infinite;
  }

  .dossier::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #e8547a, transparent);
    animation: draw-line 1.2s ease forwards;
    z-index: 100;
  }

  .scanline {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 60px;
    background: linear-gradient(transparent, rgba(232, 84, 122, 0.03), transparent);
    animation: scanline 6s linear infinite;
    pointer-events: none;
    z-index: 99;
  }

  .noise {
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.4;
    pointer-events: none;
    z-index: 98;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  /* HEADER */
  .header {
    border-left: 3px solid #e8547a;
    padding-left: 18px;
    margin-bottom: 36px;
    animation: fadeIn 0.6s ease forwards;
  }

  .header-meta {
    font-size: 10px;
    letter-spacing: 4px;
    color: #e8547a99;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .header-name {
    font-family: 'Barlow Condensed', 'Impact', sans-serif;
    font-size: clamp(44px, 10vw, 72px);
    font-weight: 700;
    letter-spacing: 6px;
    text-transform: uppercase;
    color: #f0f0f8;
    line-height: 1;
    margin-bottom: 4px;
    position: relative;
  }

  .header-name span {
    color: #e8547a;
  }

  .header-sub {
    font-size: 11px;
    letter-spacing: 5px;
    color: #e8547a88;
    text-transform: uppercase;
    margin-top: 8px;
  }

  .stamp {
    position: absolute;
    top: 0; right: 0;
    border: 3px solid #e8547a55;
    color: #e8547a55;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    padding: 6px 12px;
    text-transform: uppercase;
    transform: rotate(-8deg);
    animation: stamp-in 0.8s 0.9s both;
    font-family: 'Barlow Condensed', sans-serif;
  }

  /* DIVIDER */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, #e8547a66, #e8547a22, transparent);
    margin: 28px 0;
  }

  /* SECTION */
  .section {
    margin-bottom: 28px;
    animation: fadeIn 0.5s ease both;
  }

  .section-label {
    font-size: 9px;
    letter-spacing: 5px;
    color: #e8547a;
    text-transform: uppercase;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, #e8547a33, transparent);
  }

  /* ID GRID */
  .id-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
  }

  .id-field {
    background: #0f0f1a;
    border: 1px solid #e8547a18;
    padding: 10px 14px;
    animation: pulse-border 4s infinite;
  }

  .id-key {
    font-size: 8px;
    letter-spacing: 3px;
    color: #e8547a77;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .id-val {
    font-size: 13px;
    color: #e8e8f4;
    letter-spacing: 1px;
  }

  .id-val.pink { color: #e8547a; }
  .id-val.dim { color: #888899; font-size: 11px; }

  /* ALIASES */
  .alias-group {
    margin-bottom: 14px;
  }

  .alias-tier {
    font-size: 8px;
    letter-spacing: 3px;
    color: #888899;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .alias-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .tag {
    font-size: 10px;
    letter-spacing: 2px;
    padding: 4px 10px;
    border: 1px solid;
    text-transform: uppercase;
    transition: all 0.2s;
    cursor: default;
  }

  .tag:hover { filter: brightness(1.3); }

  .tag.rose { border-color: #e8547a55; color: #e8547a; background: #e8547a0a; }
  .tag.slate { border-color: #4a5568; color: #9aa5b4; background: #1a1a2a; }

  /* BODY TEXT */
  .body-text {
    font-size: 13px;
    line-height: 1.9;
    color: #b0b0c4;
    letter-spacing: 0.3px;
  }

  .body-text .highlight { color: #e8e8f4; }
  .body-text .accent { color: #e8547a; }

  /* EQUIPMENT */
  .equip-item {
    background: #0c0c17;
    border-left: 2px solid #e8547a;
    padding: 14px 16px;
    margin-bottom: 10px;
  }

  .equip-name {
    font-size: 11px;
    letter-spacing: 3px;
    color: #e8547acc;
    text-transform: uppercase;
    margin-bottom: 6px;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 600;
  }

  .equip-desc {
    font-size: 12px;
    line-height: 1.8;
    color: #9090a8;
  }

  /* TRAIT BARS */
  .trait-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 10px;
  }

  .trait-label {
    font-size: 9px;
    letter-spacing: 2px;
    color: #888899;
    text-transform: uppercase;
    width: 120px;
    flex-shrink: 0;
  }

  .trait-bar {
    flex: 1;
    height: 3px;
    background: #1a1a2a;
    position: relative;
    overflow: hidden;
  }

  .trait-fill {
    height: 100%;
    background: linear-gradient(90deg, #e8547a99, #e8547a);
    transition: width 1.2s ease;
  }

  .trait-val {
    font-size: 10px;
    color: #e8547a;
    width: 24px;
    text-align: right;
    flex-shrink: 0;
  }

  /* INTEL BLOCK */
  .intel-block {
    background: #0c0c17;
    border: 1px solid #e8547a18;
    padding: 14px 16px;
    margin-bottom: 8px;
    position: relative;
  }

  .intel-block::before {
    content: attr(data-level);
    position: absolute;
    top: -8px; right: 12px;
    font-size: 8px;
    letter-spacing: 3px;
    color: #e8547a;
    background: #0c0c17;
    padding: 0 6px;
    text-transform: uppercase;
  }

  .intel-text {
    font-size: 12px;
    line-height: 1.8;
    color: #9090a8;
  }

  .intel-text .flag { color: #e8547a; }

  /* REDACTED */
  .redacted {
    background: #e8e8f4;
    color: transparent;
    user-select: none;
    display: inline;
    border-radius: 1px;
  }

  /* FOOTER */
  .footer {
    margin-top: 40px;
    padding-top: 16px;
    border-top: 1px solid #e8547a18;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: gap;
    gap: 8px;
  }

  .footer-left {
    font-size: 9px;
    letter-spacing: 3px;
    color: #444458;
    text-transform: uppercase;
  }

  .cursor {
    display: inline-block;
    width: 8px;
    height: 13px;
    background: #e8547a;
    animation: blink 1s infinite;
    vertical-align: middle;
    margin-left: 2px;
  }
`;

const traits = [
  { label: "Combat Aptitude", val: 97 },
  { label: "Technical Intel", val: 91 },
  { label: "Threat Level", val: 88 },
  { label: "Composure", val: 85 },
  { label: "Emotional Guard", val: 94 },
  { label: "Romance Tolerance", val: 3 },
];

export default function NiccsBrooke() {
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{glitch + css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@400;600;700&display=swap" rel="stylesheet" />

      <div className="dossier">
        <div className="scanline" />
        <div className="noise" />

        <div className="container">

          {/* HEADER */}
          <div className="header" style={{ position: "relative" }}>
            <div className="stamp">Classified</div>
            <div className="header-meta">// E.D.E.N. Operative File — Earth's Dome &amp; Evacuation Nexus — Independent Registry</div>
            <div className="header-name">
              NICCS <span>BROOKE</span>
            </div>
            <div className="header-sub">Pink Rose Reaper &nbsp;·&nbsp; Death Incarnate &nbsp;·&nbsp; Shapeshifter</div>
          </div>

          {/* ID */}
          <div className="section" style={{ animationDelay: "0.1s" }}>
            <div className="section-label">// Subject Identification</div>
            <div className="id-grid">
              <div className="id-field">
                <div className="id-key">Registered Name</div>
                <div className="id-val">Niccs Brooke</div>
              </div>
              <div className="id-field">
                <div className="id-key">Age</div>
                <div className="id-val">21</div>
              </div>
              <div className="id-field">
                <div className="id-key">Status</div>
                <div className="id-val pink">Active — Unaffiliated</div>
              </div>
              <div className="id-field">
                <div className="id-key">Classification</div>
                <div className="id-val">Independent Operative</div>
              </div>
              <div className="id-field">
                <div className="id-key">Residence</div>
                <div className="id-val dim">Eden (Dome Interior) — Sector Undisclosed</div>
              </div>
              <div className="id-field">
                <div className="id-key">Next of Kin</div>
                <div className="id-val dim">None on Record</div>
              </div>
              <div className="id-field">
                <div className="id-key">Year of Birth (Est.)</div>
                <div className="id-val dim">~005 EC — Eden Native</div>
              </div>
              <div className="id-field">
                <div className="id-key">File Date</div>
                <div className="id-val dim">Solym — 026 EC</div>
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* ALIASES */}
          <div className="section" style={{ animationDelay: "0.2s" }}>
            <div className="section-label">// Known Designations</div>
            <div className="alias-group">
              <div className="alias-tier">— Civilian Level</div>
              <div className="alias-tags">
                <span className="tag slate">Pink Haired Lady</span>
                <span className="tag slate">Neighborhood's Hero</span>
                <span className="tag slate">Female Robin Hood</span>
              </div>
            </div>
            <div className="alias-group" style={{ marginTop: 12 }}>
              <div className="alias-tier">— Operative Level</div>
              <div className="alias-tags">
                <span className="tag rose">Shapeshifter</span>
                <span className="tag rose">Pink Rose Reaper</span>
                <span className="tag rose">Death Incarnate</span>
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* APPEARANCE */}
          <div className="section" style={{ animationDelay: "0.25s" }}>
            <div className="section-label">// Appearance &amp; Presence</div>
            <p className="body-text">
              Niccs presents herself with an ease that borders on deliberate — the kind of person a room notices without being able to explain why. Her most identifying feature is her <span className="accent">pink hair</span>, the one constant she makes no effort to conceal. It has become her signature whether she intends it or not, giving rise to her most casual alias among Eden's civilians.{" "}
              <span className="highlight">She wears a single ring on her right hand</span> — unassuming in appearance, never removed. Her hands, when looked at closely, carry the faint trace of embedded technology beneath the skin: barely visible lines, like circuitry that chose to stay quiet. She carries no visible weapons. She doesn't need to.
            </p>
            <p className="body-text" style={{ marginTop: 12 }}>
              Her disguise is not a mask or a change of clothes. <span className="highlight">She keeps her real face at all times.</span> What she changes is everything else — posture, affect, cadence, presence. The mercenary who walks into a contract and the girl buying from a corner stall look identical. Nobody makes the connection. That's the point.
            </p>
          </div>

          <div className="divider" />

          {/* BACKGROUND */}
          <div className="section" style={{ animationDelay: "0.3s" }}>
            <div className="section-label">// Background — Operative History</div>
            <p className="body-text">
              Niccs Brooke has no registered family. No guardian record. No institution trail. What exists is a <span className="highlight">gap in the system</span> — a child who existed in a poor sector of E.D.E.N. and then, quietly, began to fill that gap herself.
              Born around <span className="accent">005 EC</span>, she is a product of the dome entirely — she has never seen what lies beyond the wall, never known the world that was lost, and carries none of the grief the first generation brought through the gates with them. To her, E.D.E.N. is not a refuge. It is simply where she is from. The 220-meter walls and the railway stations built into them are not symbols of survival. They are infrastructure. Background noise.
            </p>
            <p className="body-text" style={{ marginTop: 12 }}>
              By early adolescence she had taught herself enough engineering to build functional hardware from salvage. She sold it. Upgraded it. Sold it again. By the time most people her age were still figuring out what they wanted, she had already learned the more important lesson:{" "}
              <span className="accent">what you're good at is a currency, and she had more of it than anyone around her knew.</span>
            </p>
            <p className="body-text" style={{ marginTop: 12 }}>
              The shift into contract work was not dramatic. It was practical. Her technical skills gave her access. Her instincts gave her an edge. And somewhere along the way she discovered that she was not just good at the work — she genuinely didn't mind it. The work paid well. The dangerous parts kept her interested. The rest was logistics.{" "}
              <span className="highlight">She operates under no faction, answers to no authority, and takes contracts from both sides of any line you care to draw.</span> Not because she has no principles, but because she decided a long time ago that principles are something you build yourself — and hers don't include anyone else's chain of command.
            </p>
            <p className="body-text" style={{ marginTop: 12 }}>
              In her neighborhood she is known differently. Nobody there connects the quiet pink-haired woman to the operative the underworld whispers about. What they know is that things get handled. Problems that should have stayed problems don't. <span className="accent">She doesn't explain it and they don't ask.</span> An unspoken arrangement that suits everyone.
            </p>
          </div>

          <div className="divider" />

          {/* PSYCHOLOGICAL */}
          <div className="section" style={{ animationDelay: "0.35s" }}>
            <div className="section-label">// Psychological Assessment</div>
            <p className="body-text">
              Niccs is <span className="highlight">unbothered in a way that is not performed</span> — she genuinely does not carry the weight of other people's opinions. She speaks directly, filters little, and has a low tolerance for things she finds unnecessary, which covers a surprisingly wide range of human behavior. This is not cruelty. It is economy. She says what she means and expects the same in return.
            </p>
            <p className="body-text" style={{ marginTop: 12 }}>
              She is also <span className="highlight">deeply competent and quietly knows it.</span> There is no need to announce what you can simply demonstrate. Her confidence is not loud — it is the kind that has never needed an audience.
            </p>
            <p className="body-text" style={{ marginTop: 12 }}>
              In the field, her only reported behavioral anomaly is a marked preference for engagement over avoidance on low-difficulty contracts.{" "}
              <span className="accent">When a mission is too easy, boredom becomes a variable.</span> Boredom, in her case, tends toward violence. Operatives who have worked adjacent to her have noted that she appears to find straightforward extractions somewhat disappointing.
            </p>
            <p className="body-text" style={{ marginTop: 12 }}>
              <span className="highlight">Romantic interaction constitutes a classified soft point.</span> Subject demonstrates consistent and apparently involuntary system failure when approached sincerely in this context. Avoidance behavior is aggressive. Denial is immediate and unconvincing. Further detail is unavailable as no one has successfully documented a second occurrence.
            </p>

            {/* TRAIT BARS */}
            <div style={{ marginTop: 20 }}>
              {traits.map((t, i) => (
                <div className="trait-row" key={t.label} style={{ animationDelay: `${0.4 + i * 0.06}s` }}>
                  <div className="trait-label">{t.label}</div>
                  <div className="trait-bar">
                    <div
                      className="trait-fill"
                      style={{ width: filled ? `${t.val}%` : "0%" }}
                    />
                  </div>
                  <div className="trait-val">{t.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* EQUIPMENT */}
          <div className="section" style={{ animationDelay: "0.5s" }}>
            <div className="section-label">// Equipment &amp; Augmentations</div>

            <div className="equip-item">
              <div className="equip-name">Type-Ø Containment Ring — "The Vessel"</div>
              <div className="equip-desc">
                A single ring worn on the right hand. The ring itself is inert — its only function is containment. The actual weapon is the compressed energy stored within it: a scythe of considerable destructive yield formed entirely from controlled energy output. The ring is not the weapon. The ring is the box. Most people who try to take it find out the difference immediately.
              </div>
            </div>

            <div className="equip-item">
              <div className="equip-name">Subdermal Energy Interface — "The Hands"</div>
              <div className="equip-desc">
                Embedded technology within both hands allows Niccs to interface directly with the weapon's energy, controlling it with fluid precision — dispersing, reshaping, and redirecting it in real-time as though it were a liquid suspended in the air. If the scythe is destroyed, confiscated, or forcibly removed, the energy can be phased out of the weapon through any surface. It was never theirs to keep.
              </div>
            </div>

            <div className="equip-item">
              <div className="equip-name">Personal Modifications — Self-Engineered</div>
              <div className="equip-desc">
                Niccs designs, repairs, and upgrades her own equipment. She does not work with outside armorers or rely on suppliers. When her gear requires maintenance she handles it personally — with a level of technical fluency that suggests most of what she carries was built from scratch to begin with.
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* THREAT ASSESSMENT */}
          <div className="section" style={{ animationDelay: "0.55s" }}>
            <div className="section-label">// Amalgamation — Threat Assessment &amp; Engagement Record</div>
            <p className="body-text">
              The <span className="accent">Amalgamation</span> — the collective designation for the infestation that drove humanity behind E.D.E.N.'s walls — is the defining threat of this era. For most citizens of the dome, it is the source of generational trauma, the thing their parents fled from, the reason the 220-meter walls exist at all. For Niccs Brooke, it is a{" "}
              <span className="highlight">contract category.</span>
            </p>
            <p className="body-text" style={{ marginTop: 12 }}>
              Born inside the dome, she carries none of the inherited fear. She did not watch the world fall. She does not mourn what was lost outside. What she has is a precise, technical read on what the Amalgamation actually represents in an engagement scenario — and that read is straightforwardly{" "}
              <span className="accent">favorable.</span> Amalgamation contracts are not boring. They do not have easy routes or low-resistance extractions. They require actual attention, actual improvisation, and an actual threat of consequence. By her own internal metrics, that qualifies as good work.
            </p>
            <p className="body-text" style={{ marginTop: 12 }}>
              She has accepted wall-side contracts on multiple occasions — perimeter defense, breach response, station-to-station escort along the wall railway — and has been noted by military personnel as{" "}
              <span className="highlight">effective in ways that are difficult to formally document</span>, given that she leaves no filing trail and the engagements she was present for tend to end faster than expected. Whether she has operated beyond the wall is{" "}
              <span className="accent">unconfirmed by official record.</span> The unofficial inference is left to the reader.
            </p>
            <p className="body-text" style={{ marginTop: 12 }}>
              Her stance on the government's long-term reclamation objective is unrecorded. She has not volunteered an opinion. The most reliable inference available is that if a contract is attached to it and the Amalgamation is involved,{" "}
              <span className="highlight">she will consider it.</span>
            </p>
          </div>

          <div className="divider" />

          {/* INTEL */}
          <div className="section" style={{ animationDelay: "0.6s" }}>
            <div className="section-label">// Supplementary Intel — Low Clearance</div>

            <div className="intel-block" data-level="note">
              <p className="intel-text">
                Subject maintains one known pet: a jellyfish, species <span className="redacted">undisclosed</span>, kept in her personal residence. Behavioral observation indicates she speaks to it with a candor not otherwise documented in any professional or social context. Whether this constitutes emotional disclosure or simply the habit of someone who prefers an audience that cannot repeat what it hears is <span className="flag">unconfirmed.</span>
              </p>
            </div>

            <div className="intel-block" data-level="note">
              <p className="intel-text">
                Subject has demonstrated a marked and apparently involuntary positive response to rabbits. Behavioral shift upon visual contact includes a measurable drop in baseline aggression, slowed movement, and — on <span className="flag">one documented occasion</span> — an attempt to conceal the reaction upon noticing she was being observed. The attempt was unsuccessful.
              </p>
            </div>

            <div className="intel-block" data-level="note">
              <p className="intel-text">
                Despite operating freely across both sides of legitimate and illegitimate contracts, Niccs maintains an <span className="flag">unofficial pattern of material redistribution</span> toward the lower-sector neighborhood where she grew up. She has not acknowledged this publicly. She has not denied it either. It is, like most things about her, simply present — in the background, deliberate, and not up for discussion.
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="footer">
            <div className="footer-left">E.D.E.N. Operative Registry — File NB-21 — Eyes Only</div>
            <div className="footer-left">Solym — 026 EC &nbsp;·&nbsp; STATUS: ACTIVE <div className="cursor" style={{ display: "inline-block" }} /></div>
          </div>

        </div>
      </div>
    </>
  );
}
