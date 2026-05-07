# UI/UX Inspiration: Workplace Pulse Platforms

To build a high-signal, highly scannable "workplace pulse" platform, we should look at platforms that successfully balance anonymity, emotional venting, and hard data (salaries, pros/cons).

Here is a curated list of platforms worldwide and locally that you can take inspiration from, along with specific UI/UX elements to observe.

## 🌍 Worldwide Inspiration

### 1. Blind (teamblind.com)
**Vibe:** Raw, anonymous, high-emotion, fast-moving.
Blind is the closest conceptual cousin to a "workplace pulse." It's where employees go to vent, ask for salary advice, and discuss layoffs anonymously.
* **What to look at:**
  * **The Feed Structure:** Notice how text-heavy but scannable their feed is. They use very tight spacing.
  * **Anonymity Signals:** See how they handle user avatars (usually just a company logo or an obscured icon) to maintain the feeling of safety.
  * **Polls & Tags:** Their UI for quick polls and tagging is very effective for getting immediate, low-friction engagement.
  * ***What to avoid:*** Their UI can sometimes feel *too* chaotic or dated. We want our dark purple theme to feel more premium.

### 2. Levels.fyi (levels.fyi)
**Vibe:** Data-dense, highly analytical, hyper-functional.
While Levels.fyi is famous for salary data, their recent expansions into company reviews and benefits are masterpieces of data density.
* **What to look at:**
  * **Data Visualization:** Look at how they display salary ranges and compensation breakdowns. They use sleek, thin progress bars and extremely tight typography.
  * **Comparison UIs:** Their side-by-side company comparison tools are incredibly easy to read.
  * **Skeletons & Loading:** They are masters of perceived performance. Notice their skeleton loaders when fetching data.

### 3. Fishbowl (fishbowlapp.com)
**Vibe:** Community-driven, conversational, slightly more professional than Blind.
Fishbowl organizes conversations into "bowls" (groups). It feels a bit like Reddit for professionals.
* **What to look at:**
  * **Card Design:** Their feed cards are very modern. They use soft rounded corners, good typography, and clear visual hierarchy for the "original poster" vs "company."
  * **Color Coding:** Notice how they use subtle color tints to differentiate different types of posts or industries.

### 4. Glassdoor (Mobile App version)
**Vibe:** The corporate standard, slowly trying to become more "social."
Glassdoor's desktop site is exactly the "directory" vibe we are trying to avoid. However, their recent mobile app updates have tried to introduce "bowls" and a more feed-like experience.
* **What to look at:**
  * **Pros/Cons Layout:** Look at how they structure their traditional Pros/Cons lists in reviews.
  * ***What to avoid:*** The heavy, slow, multi-page friction of leaving a review. Our `SubmitModal` is already miles ahead in terms of speed.

---

## 🇧🇩 Local Context (Bangladesh)

In Bangladesh, there isn't a dominant, dedicated "Blind-like" platform. However, the *behavior* of sharing this information exists in other formats. We can take UX cues from these to ensure the app feels familiar.

### 1. Facebook Groups (e.g., "Desperately Seeking..." or tech communities)
**Vibe:** Chaotic, highly engaged, deeply local.
Most raw workplace discussion in BD happens in private Facebook groups.
* **What to look at:**
  * **Comment Density:** Look at how users read through long threads of comments. Facebook optimizes for scrolling. We want our feed to have that same addictive "scrollability."
  * **Reactions:** The way FB handles quick emotional reactions (Love, Angry, Haha) is deeply ingrained in local users. Our color-coded Pros/Cons lean into this quick visual feedback.

### 2. Bdjobs (bdjobs.com)
**Vibe:** Utilitarian, corporate, legacy.
This is the standard for job hunting in BD, but it lacks the "employee voice."
* **What to look at:**
  * **Search & Filters:** Look at how they handle searching by company name or location. We can take their search paradigms but execute them with a much more modern, dark-mode aesthetic.
  * ***What to avoid:*** Cluttered navbars, overwhelming text, and outdated color schemes.

## 🎨 Design System & Trend Inspiration (Dribbble/Behance)

To refine your specific **Dark Purple / Glassmorphism** aesthetic, search Dribbble for these exact keywords:
1. `"Fintech Dark Mode Dashboard"` (for data density)
2. `"Crypto Wallet App UI"` (they master the dark purple/neon glow aesthetic)
3. `"Anonymous Social Feed UI"` 

**Next Steps for UX Planning:**
Which of these vibes resonates most with where you want Chakri Chini to go? Do you want it to lean more towards the **data-heavy feel of Levels.fyi** or the **raw, social feel of Blind**?
