import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LikeButton } from "@/components/LikeButton";
import { ShareButton } from "@/components/ShareButton";
import { supabase } from "@/integrations/supabase/client";
import {
  Scroll,
  ArrowLeft,
  Heart,
  ShoppingBag,
  Instagram,
  BookOpen,
  Clock,
  Unlock,
  Shield,
  Award,
  Trophy
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  type: string;
  description: string | null;
}

const STORY_TITLE = "The Festival of the Superb Owl";
const STORY_SUBTITLE = "A Chronicle from the Corporate Empire";

const STORY_PREVIEW = `It began, as all great Roman disasters begin, with a memo from Human Resources.

MEMORANDUM
FROM: The Department of Workplace Morale & Mandatory Enjoyment
TO: All Citizens of Imperium Corporatum
RE: The Festival of the Superb Owl — Ludus Maximus LIX

Citizens,

As you are no doubt aware, the annual Festival of the Superb Owl is upon us once more. This year's Ludus Maximus LIX shall pit the Eagles of Philadelphia against the Chiefs of Kansas — a contest that, we are told, matters deeply to many of you and will be used as an excuse to consume an unconscionable quantity of guacamole.

In the spirit of inclusive celebration, and in compliance with Senate Resolution 47-B ("On the Mandating of Fun in the Workplace"), the following directives are now in effect:

1. All employees MUST wear their team's toga to the office on Monday following the game. Failure to participate will be logged as a "morale violation" and forwarded to your direct supervisor, your supervisor's supervisor, and the Oracle of Compliance.

2. Cubicle decorations are encouraged but must not exceed the height of the partition walls. Last year, Gaius from Accounts Receivable constructed a functioning trebuchet. This is no longer permitted.

3. The office viewing party, organized by Brutus of the Adjacent Cubicle, is MANDATORY. Attendance will be taken.

Marcus read the memo three times. Not because it was complex, but because each reading revealed a new layer of institutional madness, like peeling an onion that had been marinated in corporate policy and left to ferment in a middle manager's ambition.

"Mandatory," he said aloud.

Cassius looked up from his own scroll — a quarterly earnings report that contained so many footnotes it had developed footnotes of its own. "What's mandatory now?"

"The viewing party. For the Superb Owl. Brutus has organized it."

"Brutus organized something?"

"Brutus organized everything. There's a sign-up sheet for appetizers. There's a seating chart. There's a designated area for people who want to watch the advertisements instead of the game, which, if we're being honest, is most of the office."

Cassius leaned back in his chair, which creaked in a way that suggested it had been requisitioned during the reign of Augustus and never replaced. "I've survived restructurings, Cassius. I've survived the Great Pivot of MMXXII. I've survived three different CEOs, each of whom assured us that THIS time the mission statement was final. But a mandatory viewing party organized by Brutus? That's where empires go to die."

Marcus pulled up the sign-up sheet on his tablet — a wax tablet, naturally, because the IT department had been 'evaluating new technology solutions' for six years and had yet to approve anything invented after the sundial.

The sheet was already full.

Brutus had signed himself up to bring seven-layer dip, which Marcus suspected would contain at most four layers, with the remaining three being various configurations of sour cream. Tiberius from Legal had committed to a six-foot sub sandwich, which he described in the sign-up notes as "a triumph of engineering and processed meats." Claudia from Marketing had written simply: "I'll bring the energy," which could mean anything from decorative streamers to a full nervous breakdown.

And there, at the bottom, in the unmistakable handwriting of CEO Maximus Decimus Quarterly — a man whose name was literally a fiscal period — was a single entry:

"I shall be screening my personal Superb Owl advertisement during the halftime intermission. Attendance is not optional. Refreshments will not be provided during this segment."`;

const STORY_FULL = `It began, as all great Roman disasters begin, with a memo from Human Resources.

MEMORANDUM
FROM: The Department of Workplace Morale & Mandatory Enjoyment
TO: All Citizens of Imperium Corporatum
RE: The Festival of the Superb Owl — Ludus Maximus LIX

Citizens,

As you are no doubt aware, the annual Festival of the Superb Owl is upon us once more. This year's Ludus Maximus LIX shall pit the Eagles of Philadelphia against the Chiefs of Kansas — a contest that, we are told, matters deeply to many of you and will be used as an excuse to consume an unconscionable quantity of guacamole.

In the spirit of inclusive celebration, and in compliance with Senate Resolution 47-B ("On the Mandating of Fun in the Workplace"), the following directives are now in effect:

1. All employees MUST wear their team's toga to the office on Monday following the game. Failure to participate will be logged as a "morale violation" and forwarded to your direct supervisor, your supervisor's supervisor, and the Oracle of Compliance.

2. Cubicle decorations are encouraged but must not exceed the height of the partition walls. Last year, Gaius from Accounts Receivable constructed a functioning trebuchet. This is no longer permitted.

3. The office viewing party, organized by Brutus of the Adjacent Cubicle, is MANDATORY. Attendance will be taken.

Marcus read the memo three times. Not because it was complex, but because each reading revealed a new layer of institutional madness, like peeling an onion that had been marinated in corporate policy and left to ferment in a middle manager's ambition.

"Mandatory," he said aloud.

Cassius looked up from his own scroll — a quarterly earnings report that contained so many footnotes it had developed footnotes of its own. "What's mandatory now?"

"The viewing party. For the Superb Owl. Brutus has organized it."

"Brutus organized something?"

"Brutus organized everything. There's a sign-up sheet for appetizers. There's a seating chart. There's a designated area for people who want to watch the advertisements instead of the game, which, if we're being honest, is most of the office."

Cassius leaned back in his chair, which creaked in a way that suggested it had been requisitioned during the reign of Augustus and never replaced. "I've survived restructurings, Cassius. I've survived the Great Pivot of MMXXII. I've survived three different CEOs, each of whom assured us that THIS time the mission statement was final. But a mandatory viewing party organized by Brutus? That's where empires go to die."

Marcus pulled up the sign-up sheet on his tablet — a wax tablet, naturally, because the IT department had been 'evaluating new technology solutions' for six years and had yet to approve anything invented after the sundial.

The sheet was already full.

Brutus had signed himself up to bring seven-layer dip, which Marcus suspected would contain at most four layers, with the remaining three being various configurations of sour cream. Tiberius from Legal had committed to a six-foot sub sandwich, which he described in the sign-up notes as "a triumph of engineering and processed meats." Claudia from Marketing had written simply: "I'll bring the energy," which could mean anything from decorative streamers to a full nervous breakdown.

And there, at the bottom, in the unmistakable handwriting of CEO Maximus Decimus Quarterly — a man whose name was literally a fiscal period — was a single entry:

"I shall be screening my personal Superb Owl advertisement during the halftime intermission. Attendance is not optional. Refreshments will not be provided during this segment."

---

THE BRACKET POOL

By midday Friday, the office had devolved into the kind of chaos typically reserved for Senate elections and company-wide printer outages.

Brutus had installed himself at the intersection of four cubicle rows — a geographic chokepoint he called "The Forum" — and was operating what he described as "a perfectly legal denarii pool" with the confidence of a man who had never once consulted Legal about anything.

"Ten denarii per entry," he announced, holding a clay tablet covered in names and numbers. "You pick the final score, the MVP, and the color of the Gatorade — excuse me, the Sacred Ceremonial Liquid — dumped upon the victorious coach. Closest guess wins the pot."

"How large is the pot?" Marcus asked.

"Four hundred and seventy denarii. Plus Gaius wagered his reserved chariot spot in the parking forum, and Livia from Procurement bet her standing desk, which she claims is ergonomic but which everyone knows she only got because she filed a complaint about her old desk during the Great Furniture Audit of MMXXIV."

"You're running a gambling operation from your cubicle."

"I'm running a team-building exercise. Read the memo. 'Inclusive celebration practices.' This is as inclusive as it gets. Everyone loses money equally."

Cassius wandered over, drawn by the commotion like a moth to a particularly bureaucratic flame. He studied the bracket board that Brutus had mounted on the cubicle wall — a sprawling matrix of predictions, side bets, and what appeared to be a secondary market for trading prop bet positions.

"You've created derivatives," Cassius said quietly.

"I've created engagement," Brutus corrected.

"You've created a shadow economy. There's a futures market on whether the halftime performer will have a wardrobe malfunction. There's a credit default swap on guacamole availability. Brutus, this is more complex than our actual business model."

"Our actual business model IS complex gambling dressed up as quarterly projections. I'm just being honest about it."

He wasn't wrong. Marcus had to admit that. The entire economy of Imperium Corporatum was, at its core, a series of bets placed by people in togas who were extremely confident about things they didn't understand. The Superb Owl bracket pool was simply that principle stripped of its pretensions and served with chips and salsa.

---

THE GIFTS

The trouble with the Festival of the Superb Owl was not the game itself. The game was, by all historical accounts, the least interesting part of the festival. No, the trouble was everything that surrounded the game — the rituals, the obligations, the unspoken social contracts that turned a simple athletic contest into a week-long performance of personality.

Take, for instance, the matter of the gag gifts.

It had become tradition in the office — nobody knew when it started, nobody knew who started it, and nobody could stop it — to exchange small tokens of humiliation in the days leading up to the Superb Owl. These were not gifts of goodwill. They were gifts of psychological warfare, wrapped in tissue paper and plausible deniability.

On Thursday morning, Tiberius from Legal arrived at his desk to find a small, elegantly packaged tin sitting on his keyboard. The label read: "YOUR BREATH STINKS — Sour Mints for the Socially Unaware." Inside were mints so aggressively sour they could strip the enamel off a gladiator's teeth. The attached card read: "For the halftime commentary nobody asked for. Go Eagles."

Tiberius held the tin aloft like a man examining evidence at trial. "Who sent this?"

Silence. The cubicle farm offered nothing but the hum of fluorescent torches and the distant sound of someone microwaving fish in the break room — itself an act of workplace terrorism that HR had yet to adequately address.

"I will find out," Tiberius said, with the quiet menace of a man who had once deposed a department head using nothing but a carefully worded email chain and a Freedom of Information request. "And when I do, I will respond with proportional force."

He did find out. It was Brutus. It was always Brutus.

But by then, the gag gift arms race had already escalated. Claudia from Marketing received a "Cat Lover's Monthly" magazine subscription, anonymously purchased and set to arrive at her desk for the next twelve months. She was, vocally, a dog person. She had photos of her three rescue dogs on her desk, on her screensaver, and tattooed — if office rumors were to be believed — somewhere that was none of anyone's business. The magazine subscription was an act of war.

"This is targeted harassment," Claudia announced to no one in particular.

"It's team-building," Brutus called from The Forum. "Read the memo."

Gaius from Accounts Receivable, meanwhile, was dealing with his own gift: a bottle of cologne called "You Smell Like Shit," which had been left in his gym bag with a note that read: "For after the game. Because we all know what happens in that locker room you call a home office. From a concerned citizen."

Gaius, to his credit, opened the bottle, sniffed it, and nodded approvingly. "This actually smells incredible," he said. "Like cedar and vengeance." He sprayed it on his wrists. He sprayed it on his neck. He walked through the office like a man who had been personally blessed by the god of petty retail spite. By the end of the day, three people had asked him where they could buy it.

---

THE MEMO FROM HR

At 3:47 PM on Friday — a time specifically chosen, Marcus suspected, to ensure maximum disruption with minimum accountability — the Department of Human Resources released a follow-up memo.

ADDENDUM TO: Festival of the Superb Owl — Inclusive Celebration Practices
FROM: Portia, Senior Vice Consul of People & Culture

Citizens,

It has come to our attention that certain celebration practices surrounding the Festival of the Superb Owl may not be fully aligned with our Values of Inclusivity, Respect, and Mandatory Enthusiasm.

Please be advised of the following:

1. When discussing the outcome of the game, please use inclusive language. Rather than "we won" or "we lost," consider phrases such as "the outcome aligned with certain expectations" or "the result was experienced differently by various stakeholders."

2. Trash talk is permitted within reason. "Within reason" is defined as: nothing that would be inadmissible in a Senate hearing, nothing that references a colleague's personal life, and absolutely nothing about the city of Philadelphia.

3. If you did not watch the game, you are not required to pretend that you did. However, if you choose to pretend, please commit fully. Half-hearted deception is worse than honest disengagement. We've all worked with Gaius. We know what half-hearted looks like.

4. The CEO's personal advertisement will be screened during the halftime intermission of the office viewing party. Reactions should be supportive. Constructive feedback may be submitted in writing no sooner than thirty (30) days after the screening. Anonymous feedback will not be accepted. There will be no Q&A.

Marcus printed the memo. Then he printed it again, because the first copy didn't adequately capture the font choice — Comic Sans, a typeface that had been banned by the Roman Typographical Standards Board in MMXVIII but which HR continued to use as an act of quiet rebellion.

"Inclusive language," Cassius murmured, reading over Marcus's shoulder. "They want us to use inclusive language about a football game."

"They want us to use inclusive language about everything. Last quarter they sent a memo asking us to stop saying 'deadline' because it contains the word 'dead,' which could be triggering to people who have experienced mortality."

"Everyone has experienced mortality. That's what mortality is."

"I pointed that out. They scheduled me for a sensitivity workshop."

---

THE VIEWING PARTY

The party was held in Conference Room Jupiter — the largest meeting space in the building, named after the king of the gods and furnished with chairs that had been explicitly designed to make sitting uncomfortable, presumably to discourage meetings from running long. The chairs had failed at this purpose. Meetings in Conference Room Jupiter routinely lasted four hours, because discomfort, it turned out, did not make Romans more efficient. It just made them angry and unable to concentrate, which was, coincidentally, the ideal psychological state for watching professional football.

Brutus had transformed the room. Banners hung from the ceiling. A projection screen — requisitioned from the AV department through a process that Brutus described as "negotiation" and the AV department described as "theft" — displayed a countdown to kickoff. The food table stretched along the entire back wall, groaning under the weight of contributions that ranged from the ambitious (Tiberius's six-foot sub, which was in fact closer to five feet, a discrepancy that Legal would surely audit) to the baffling (someone had brought a single artisanal cheese that cost more than Marcus's chariot payment).

The guacamole situation was, as predicted, catastrophic. Seven people had brought guacamole. Not because they loved guacamole — though they did, as all Romans do, for the avocado is the fruit of the gods and its mashed form the sacred paste of civilization — but because guacamole was the only thing you could bring to an office party without anyone questioning your competence. Bring a casserole and people judge your life choices. Bring guacamole and you're a team player.

"There's more guacamole than people," Marcus observed.

"There's always more guacamole than people," Cassius replied. "That's the fundamental equation of the Superb Owl. The avocado-to-human ratio is the true measure of a civilization's excess."

CEO Maximus Decimus Quarterly arrived at precisely 6:00 PM, flanked by two members of his executive guard and carrying a leather satchel that Marcus suspected contained nothing but the USB drive with his personal advertisement and an emergency supply of self-regard.

"Citizens!" Maximus boomed. He had a voice that carried — not because it was powerful, but because it was loud, which he had long ago confused with the same thing. "The Festival of the Superb Owl is upon us! Let us celebrate as one corporate family — united in purpose, aligned in strategy, and committed to the values that make Imperium Corporatum the market leader in... what do we do again?"

"Enterprise solutions," someone offered.

"Enterprise solutions! The backbone of civilization!"

He took his seat — a special chair that had been brought in from his office, because the Conference Room Jupiter chairs were, in his words, 'incompatible with executive vertebrae.' The chair was leather. It reclined. It had lumbar support. It cost more than the six-foot sub, the artisanal cheese, and all seven guacamoles combined.

---

THE DISAPPEARANCE OF THE SIX-FOOT SUB

The game had not yet started when the first crisis erupted.

Tiberius's six-foot sub — his triumph of engineering and processed meats — had vanished.

Not partially vanished. Not nibbled at the edges. Entirely, completely, structurally gone. The tray remained. The decorative lettuce garnish remained. But the sub itself — five feet of Italian meats, provolone, oil, vinegar, and what Tiberius insisted was "artisanal oregano sourced from a guy I know" — had disappeared as if it had never existed.

"I left the room for three minutes," Tiberius said, his voice carrying the flat calm of a man about to initiate litigation. "Three minutes. I went to get napkins. Napkins, Marcus. The most innocent errand in the history of errands. And when I returned, my sub was gone."

"The entire sub?"

"The ENTIRE sub. Five feet of sub. Roughly forty pounds of meat and bread. Someone removed it from this room in under three minutes without being seen. That's not theft, Marcus. That's a military operation."

The investigation consumed more of the office's collective attention than the first quarter of the game. Brutus appointed himself lead investigator, which everyone objected to because Brutus was also the primary suspect. He had motive (he had publicly stated that Tiberius's sub "looked like it was assembled by someone who lost a bet"), means (he was sitting closest to the food table), and opportunity (he claimed to have been "in the restroom" during the three-minute window, a claim that nobody could verify and everyone doubted).

"I demand a tribunal," Tiberius announced during a commercial break.

"We're not convening a tribunal over a sandwich," Cassius said.

"It wasn't a sandwich. It was a sub. A six-foot sub. Five-foot. The distinction matters legally."

The sub was never found. Months later, someone would discover a suspicious stain in the ceiling tiles above Conference Room Jupiter that smelled faintly of oregano, but by then the investigation had been formally closed and the incident reclassified as a "food-related learning opportunity."

---

THE HALFTIME INTERLUDE

At halftime, with the game itself proving to be exactly the kind of competent-but-uninspiring contest that made people grateful for the advertisements, CEO Maximus Decimus Quarterly stood and addressed the room.

"Citizens. As you know, I have personally funded a Superb Owl advertisement this year. It will air nationally during the third quarter. However, I wanted you — my corporate family — to see it first."

He connected his USB drive to the projector. The room went dark. Marcus felt Cassius tense beside him like a man bracing for a chariot crash.

The advertisement opened on a sweeping aerial shot of the Imperium Corporatum headquarters. Dramatic orchestral music swelled. Then, emerging from the front doors in slow motion, wearing a toga that was clearly tailored and holding what appeared to be a golden eagle, was Maximus himself.

"Imperium Corporatum," his voiceover intoned. "We don't just build enterprise solutions. We build... empires."

The ad continued for ninety seconds. It featured Maximus walking through corridors, pointing at things, shaking hands with people who were clearly actors, and at one point standing on a rooftop gazing at the horizon while the wind artfully tousled his hair — which Marcus knew for a fact was a hairpiece, because he'd once found it in the men's restroom during the company retreat of MMXXIV.

It ended with Maximus looking directly into the camera. "Imperium Corporatum. Solutions for the Empire. Solutions for You."

The room was silent.

Not the silence of awe. Not the silence of admiration. The silence of two hundred people simultaneously calculating whether their reaction would be visible to their direct supervisor.

Brutus began clapping. It was the slow, deliberate clap of a man who understood that first-mover advantage applied to sycophancy as well as market strategy. Within seconds, the room joined in. The applause built to a crescendo that had nothing to do with the quality of the advertisement and everything to do with the proximity of annual review season.

"How much did that cost?" Cassius whispered.

"Seven million denarii," Marcus replied. "I saw the invoice. It was filed under 'Brand Investment — Executive Vision Alignment.'"

"Seven million denarii. For ninety seconds of a man in a wig pointing at buildings."

"Welcome to the Festival of the Superb Owl."

---

THE GAME ITSELF

The game, when it finally concluded, was fine.

Not historic. Not legendary. Not the kind of contest that bards would sing about in taverns for generations. It was fine. The kind of fine that happens when the spectacle surrounding an event so thoroughly eclipses the event itself that the actual outcome feels like an afterthought — a footnote to the advertisements, the halftime show, the office drama, and the seven bowls of guacamole.

The Eagles won. Or the Chiefs won. It hardly mattered by then. What mattered was that Brutus had correctly predicted the color of the Sacred Ceremonial Liquid (green, matching neither team's colors, which should have been impossible but was, in Brutus's words, "just good analytics"), and had therefore won the bracket pool.

"Four hundred and seventy denarii," Brutus announced, "plus a parking spot and a standing desk. The system works."

"The system is you running an unregulated gambling operation from a cubicle," Marcus pointed out.

"The system is me understanding human nature better than Human Resources. Which, frankly, isn't difficult."

---

MONDAY MORNING

Monday arrived like a hangover — slowly, painfully, and with the full knowledge that it could have been avoided.

The toga mandate was, against all odds, enforced. Citizens shuffled into the office wearing hastily assembled team togas, most of which appeared to have been constructed from bedsheets and optimism. The losing team's fans wore theirs like funeral shrouds. The winning team's fans wore theirs like crowns. And the people who hadn't watched the game at all wore plain white togas with no allegiance, which HR had pre-approved as the "neutral celebration option."

Tiberius, still mourning his sub, arrived in a toga that was clearly just his bathrobe. When questioned, he produced a Legal memo arguing that a bathrobe met the "spirit if not the letter" of the toga mandate, and that any attempt to enforce a stricter dress code would constitute "an unreasonable burden on an employee already processing food-related trauma."

Marcus sat at his desk in a toga he'd borrowed from his son's school play costume box. It was slightly too small and featured a suspicious stain that his son claimed was "grape juice from the scene where Caesar dies." He chose not to investigate further.

"So," Cassius said, settling into his creaking chair, still wearing an unremarkable white toga. "The Festival of the Superb Owl is over."

"Until next year."

"Until next year. When Brutus will organize another mandatory viewing party. When HR will send another memo about inclusive language. When the CEO will fund another advertisement. When someone will bring too much guacamole and someone else's sub will go missing."

"The eternal cycle."

"The eternal cycle. Bread and circuses, Marcus. That's all it ever was. The Romans knew it two thousand years ago. Give the people something to watch, something to eat, and something to argue about, and they'll never notice that the Empire is crumbling around them."

Marcus looked around the office. Citizens in bedsheet togas hunched over their wax tablets, nursing headaches and debating plays that had already been played. The bracket board still hung on Brutus's cubicle wall, a monument to organized chaos. Somewhere in Conference Room Jupiter, the faint smell of oregano drifted from the ceiling tiles.

"Was the game good, at least?" Marcus asked.

Cassius thought about it. "The advertisements were excellent."

"And the halftime show?"

"Spectacular. I think. I was mostly watching to see if the CEO would have an expression during someone else's moment. He didn't."

"And the game?"

"The game was fine, Marcus. The game is always fine. Nobody watches the Superb Owl for the game. They watch it for permission — permission to eat seven bowls of guacamole, permission to skip Monday's responsibilities, permission to care loudly about something that doesn't matter so they can stop caring quietly about everything that does."

Marcus nodded. He unwrapped a sour mint from the tin on his desk — the "Your Breath Stinks" tin that had somehow migrated from Tiberius's desk to his own during the chaos of the viewing party. It was, as advertised, agonizingly sour. His eyes watered. His sinuses cleared. For one brief, glorious moment, he felt something.

"Same time next year?" he asked.

"Same time next year," Cassius confirmed. "Same bread. Same circuses. Same Empire."

Outside, the city hummed with the comfortable noise of a civilization that had perfected the art of distraction. The Festival of the Superb Owl was over. The quarterly earnings report was due. The Empire continued.

Nothing ever changes. Nothing ever has to. That is, and has always been, the arrangement.

---

The Corporate Chronicle
Satire Since Rome`;

export default function TheFestivalOfTheSuperbOwl() {
  const [products, setProducts] = useState<Product[]>([]);
  const [email, setEmail] = useState("");
  const [showFullStory, setShowFullStory] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4);
    setProducts(data || []);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowFullStory(true);
    alert("Ave, Citizen! You have been granted access to the Senate Archives.");
    setEmail("");
  };

  const readTime = 14;

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 dark:bg-stone-950">
      <Navbar />

      <main className="flex-1">
        <header className="relative bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 text-white overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 opacity-10 hidden lg:block"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 42px)`,
            }}
          />
          <div className="absolute right-0 top-0 bottom-0 w-16 opacity-10 hidden lg:block"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 42px)`,
            }}
          />

          <div className="container mx-auto px-4 py-10 relative">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to The Chronicles
            </Link>

            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1 px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-full">
                  <Shield className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400 font-bold tracking-wider text-sm">CHRONICLE VIII</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-3xl opacity-60">🏛️</span>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                <Trophy className="h-8 w-8 text-amber-500" />
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                <span className="text-3xl opacity-60">🏛️</span>
              </div>

              <h1 className="font-display text-4xl md:text-6xl mb-4 tracking-tight">
                {STORY_TITLE}
              </h1>

              <p className="text-xl text-amber-400 font-serif italic mb-6">
                {STORY_SUBTITLE}
              </p>

              <div className="flex items-center justify-center gap-6 text-stone-400 text-sm">
                <span className="flex items-center gap-2">
                  <Scroll className="h-4 w-4" />
                  February IX, MMXXVI
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {readTime} min read
                </span>
                <span className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Corporate Culture
                </span>
              </div>
            </div>
          </div>

          <div className="h-2 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
        </header>

        {/* Hero Image */}
        <div className="w-full h-64 md:h-96 relative overflow-hidden">
          <img
            src="/festival_of_the_superb_owl.png"
            alt="The Festival of the Superb Owl — Romans gather in an amphitheater around a great jeweled owl"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-100 dark:from-stone-950 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            <article className="lg:col-span-2">
              <div className="bg-stone-50 dark:bg-stone-900 rounded-lg shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600" />

                <div className="p-8 md:p-12">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-200 dark:border-stone-700">
                    <div className="flex items-center gap-3">
                      <LikeButton chronicleId="the-festival-of-the-superb-owl" />
                      <ShareButton title="The Festival of the Superb Owl" />
                    </div>
                    <div className="text-xs text-stone-400 uppercase tracking-wider">
                      Scroll VIII of VIII
                    </div>
                  </div>

                  <div className="prose prose-lg prose-stone dark:prose-invert max-w-none">
                    {showFullStory ? (
                      <>
                        <div className="flex items-center gap-2 mb-6 text-green-600 dark:text-green-400">
                          <Unlock className="h-5 w-5" />
                          <span className="text-sm font-medium uppercase tracking-wider">Full Chronicle Unlocked</span>
                        </div>
                        <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-stone-700 dark:text-stone-300">
                          {STORY_FULL.split("---\n\nTHE GIFTS").map((section, i) =>
                            i === 0 ? (
                              <span key={i}>
                                {section}
                                <img
                                  src="/festival_of_the_superb_owl_2.png"
                                  alt="The contested guacamole, the missing sub, and the HR officials distributing scrolls of inclusive celebration practices"
                                  className="w-full rounded-lg my-8 shadow-lg"
                                />
                                {"---\n\nTHE GIFTS"}
                              </span>
                            ) : (
                              <span key={i}>{section}</span>
                            )
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-stone-700 dark:text-stone-300">
                          {STORY_PREVIEW}
                        </div>

                        <div className="relative mt-12">
                          <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-t from-stone-50 dark:from-stone-900 to-transparent pointer-events-none" />

                          <div
                            className="relative overflow-hidden rounded-xl text-white animate-[breathe_4s_ease-in-out_infinite]"
                            style={{
                              background: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
                              boxShadow: '0 0 60px rgba(217, 119, 6, 0.4), 0 0 100px rgba(217, 119, 6, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                            }}
                          >
                            <div
                              className="absolute inset-0 animate-[shimmer_3s_ease-in-out_infinite]"
                              style={{
                                background: 'linear-gradient(110deg, transparent 20%, rgba(217,119,6,0.15) 50%, transparent 80%)',
                                backgroundSize: '200% 100%',
                              }}
                            />

                            <div className="absolute inset-0 rounded-xl border-2 border-amber-500/60 animate-pulse" />
                            <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

                            <div className="relative z-10 p-8 md:p-10 text-center">
                              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/10 border-2 border-amber-500/50 mb-6 animate-[bounce_3s_ease-in-out_infinite]">
                                <Unlock className="h-10 w-10 text-amber-400" />
                              </div>

                              <div className="flex items-center justify-center gap-2 mb-4">
                                <div className="h-px w-8 bg-amber-500/50" />
                                <Trophy className="h-5 w-5 text-amber-500" />
                                <div className="h-px w-8 bg-amber-500/50" />
                              </div>

                              <h3 className="font-display text-2xl md:text-3xl mb-3">
                                Seven Bowls of Guacamole. One Missing Sub.
                              </h3>
                              <p className="text-stone-300 mb-8 max-w-md mx-auto">
                                Enter your email to unlock the full chronicle and join the Senate.
                              </p>

                              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6">
                                <Input
                                  type="email"
                                  placeholder="citizen@empire.com"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                                  className="flex-1 h-14 bg-white/10 border-2 border-amber-500/40 text-white placeholder:text-stone-400 text-lg focus:border-amber-400 focus:ring-amber-400/50 rounded-lg"
                                />
                                <Button
                                  type="submit"
                                  className="h-14 px-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-900 font-bold text-lg gap-2 transition-all hover:scale-105 rounded-lg shadow-lg shadow-amber-500/25"
                                >
                                  <Unlock className="h-5 w-5" />
                                  Unlock Chronicle
                                </Button>
                              </form>

                              <button
                                onClick={() => setShowFullStory(true)}
                                className="text-stone-500 hover:text-stone-300 text-sm transition-colors"
                              >
                                Continue as Guest
                              </button>
                            </div>

                            <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="h-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600" />
              </div>

              {showFullStory && (
                <div className="mt-8 p-8 bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl border border-stone-700 text-white">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Award className="h-8 w-8 text-amber-400" />
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-display text-xl mb-2">
                        Chronicle Complete
                      </h3>
                      <p className="text-stone-400">
                        Follow @corporatepranks for daily dispatches from the Corporate Empire.
                      </p>
                    </div>
                    <a
                      href="https://www.instagram.com/corporatepranks"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-6">
                        <Instagram className="h-5 w-5" />
                        Follow
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </article>

            <aside className="space-y-6">
              <div className="lg:sticky lg:top-24 space-y-6">
                <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl p-6 text-white border border-stone-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 uppercase tracking-wider">Your Rank</p>
                      <p className="font-display text-lg text-amber-400">Citizen</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-400">Chronicles Read</span>
                      <span className="text-white font-medium">8 / 8</span>
                    </div>
                    <div className="h-2 bg-stone-700 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" />
                    </div>
                    <p className="text-xs text-stone-500">Read more to rank up to Senator</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="h-5 w-5 text-red-500" />
                    <h3 className="font-display text-lg text-stone-900 dark:text-stone-100">Fund the Resistance</h3>
                  </div>
                  <p className="text-stone-500 dark:text-stone-400 text-sm mb-4">
                    Help us keep exposing the absurdity. Every denarius counts.
                  </p>
                  <Link to="/support">
                    <Button className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold">
                      Support the Chronicle
                    </Button>
                  </Link>
                </div>

                {products.length > 0 && (
                  <div className="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
                    <div className="flex items-center gap-2 mb-4">
                      <ShoppingBag className="h-5 w-5 text-amber-600" />
                      <h3 className="font-display text-lg text-stone-900 dark:text-stone-100">
                        Tools of Mischief
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {products.slice(0, 3).map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 flex-shrink-0">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl">🎭</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 transition-colors">
                              {product.name}
                            </p>
                            <p className="text-amber-600 font-bold text-sm">${product.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <Link to="/subscription-products">
                      <Button variant="outline" className="w-full mt-4 border-stone-300 dark:border-stone-600">
                        Browse All
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-xl p-6 text-white text-center">
                  <Instagram className="h-10 w-10 mx-auto mb-3 opacity-90" />
                  <h3 className="font-display text-lg mb-2">Daily Dispatches</h3>
                  <p className="text-white/80 text-sm mb-4">
                    New stories drop daily
                  </p>
                  <a
                    href="https://www.instagram.com/corporatepranks"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="bg-white text-purple-600 hover:bg-white/90">
                      @corporatepranks
                    </Button>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <section className="py-16 bg-stone-900 text-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-amber-500/50" />
              <BookOpen className="h-6 w-6 text-amber-500" />
              <h2 className="font-display text-2xl">More Chronicles</h2>
              <div className="h-px w-12 bg-amber-500/50" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link
                to="/chronicle/the-festivitas-of-oil"
                className="bg-stone-800 rounded-xl p-6 border border-stone-700 hover:border-amber-500/50 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400 text-xs font-bold tracking-wider">CHRONICLE VII</span>
                </div>
                <h3 className="font-display text-xl text-white group-hover:text-amber-400 transition-colors">
                  The Festivitas of Oil
                </h3>
                <p className="text-stone-400 text-sm mt-2">
                  One thousand amphorae. Zero consequences.
                </p>
              </Link>

              <Link
                to="/chronicle/the-scrolls-of-the-island"
                className="bg-stone-800 rounded-xl p-6 border border-stone-700 hover:border-amber-500/50 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400 text-xs font-bold tracking-wider">CHRONICLE VI</span>
                </div>
                <h3 className="font-display text-xl text-white group-hover:text-amber-400 transition-colors">
                  The Scrolls of the Island
                </h3>
                <p className="text-stone-400 text-sm mt-2">
                  3.5 million scrolls. Washable ink. Nothing happens.
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
