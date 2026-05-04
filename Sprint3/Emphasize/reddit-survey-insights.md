# Reddit survey insights

## Context

As part of the Empathize/Understand phase, we posted a qualitative question thread in the Swedish subreddit r/sverige. The purpose was to understand how users and moderators experience political discussions, polarization, moderation, and escalation patterns in Reddit communities. The dataset consists of 55 collected Reddit comments from 22 unique authors.

This material should be treated as qualitative observation data rather than a representative survey. The answers help us understand how users describe the tone, problems, and moderation needs in political Reddit discussions.

## Main insights

## 1. Polarized tone

A clear pattern in the answers is that users describe political discussions as “vi mot dem”, hostile, and identity-based. Several users argue that discussions quickly shift from the topic itself to assumptions about the person behind the opinion. However, respondents disagree strongly about the ideological direction of the subreddit. Some describe r/sverige as right-leaning, while others compare r/Sweden or r/svenskpolitik as more left-leaning or restrictive.

**Insight:** The most important finding is not simply that the subreddit is biased in one direction, but that users interpret bias through their own political position. Perceived moderation bias is itself part of the polarization problem.

## 2. Why users leave

Users generally do not say that they leave discussions because people disagree with them. Instead, they mention patterns such as personal attacks, insults, whataboutism, deliberate misinterpretation, low-effort replies, stalking comment history, and users who appear unwilling to consider counterarguments.

**Insight:** Polarization is experienced less as “different opinions exist” and more as “discussion norms collapse”. The problem is therefore not political disagreement itself, but the quality and behaviour of interaction.

## 3. Good moderation

A recurring theme is that good moderation should not remove opinions just because they are controversial. Users often express a strong concern that moderation can become censorship. At the same time, they still want moderators to act against spam, personal attacks, racism, low-effort baiting, and behaviour that destroys the discussion.

**Insight:** A useful moderation tool should not be framed as a censorship tool. It should support rule-based moderation by highlighting behaviour, escalation risk, and discussion quality rather than judging political viewpoints.

## 4. Different views

One moderator response suggests that political threads are not necessarily the hardest to moderate as long as users stay within the rules. From the moderator perspective, problematic threads are often visible through the topic, the framing of the original post, aggressive language, many reports, and signs of baiting or low-effort agenda-driven posting.

Users, however, often focus more on perceived unfairness, moderator bias, and the feeling that some users dominate the tone of the community.

**Insight:** There is a gap between the moderator’s operational problem and the user’s experience problem. Moderators focus on rule violations, while users focus on trust, fairness, tone, and whether discussion feels meaningful.

## 5. Early warning signs

The answers point to several possible early signals of escalation:

emotionally loaded or provocative post framing
- strong “us vs them” language
- personal attacks or labels replacing arguments
- repeated whataboutism
- users accusing each other of bad faith
- many reports in a short time
- rapid comment activity around controversial topics
- low-effort or bait-like posts
- suspected brigading, bots, or coordinated voting

**Insight:** These signals could be operationalized into a data-driven prototype. Instead of only showing moderators individual reports, a tool could show early escalation indicators at thread level.

## 6. Platform effects

Some users mention that upvotes/downvotes, algorithms, and group dynamics affect which opinions become visible. A common concern is that users with minority opinions can be downvoted or overwhelmed even if they do not break rules.

**Insight:** Polarization is not only caused by individual users. It is also connected to platform mechanisms such as voting, visibility, and crowd behaviour. A data-driven tool could therefore combine text signals with interaction signals.

## Design implications

The Reddit answers suggest that our prototype should focus on **discussion climate and escalation risk**, not on detecting “right” or “wrong” political opinions.

A strong direction would be:

**A moderator support tool that identifies early signs of polarizing escalation in political discussion threads, based on behavioural and linguistic patterns such as insults, ad hominem, baiting, report volume, emotional language, and rapid activity changes.**

This fits better than a tool that simply labels a thread as “left/right” or “toxic”, because the answers show that users are sensitive to censorship and perceived political bias.

## Possible features

| User/moderator insight | Possible prototype feature |
|---|---|
| Users disengage because of personal attacks and bad-faith replies | Detect and highlight comments with ad hominem, insults, or dismissive labels |
| Moderators notice escalation through topic, framing, reports, and aggressive language | Thread-level escalation score |
| Users fear censorship | Show transparent explanations for why a thread/comment is flagged |
| Users disagree about political bias | Avoid political ideology classification as the main feature |
| Reports alone can be noisy | Combine reports with text patterns and activity spikes |
| Some users suspect brigading or coordinated behaviour | Visualize sudden vote/comment spikes or repeated similar comments |
| Moderators care about rule violations, users care about tone | Show both “rule risk” and “discussion quality risk” |

## Problem statement

**Swedish Reddit moderators and community members struggle to identify when political discussion threads are shifting from disagreement into destructive polarization. Existing moderation often reacts after rule violations have already occurred, while users experience the discussion climate as hostile, biased, or unproductive. Therefore, there is a need for a data-driven support tool that helps moderators detect early escalation patterns without censoring legitimate political disagreement.**

## Limitations

The Reddit answers should not be treated as representative for all Swedish Reddit users. The sample is self-selected, collected from one subreddit, and includes several follow-up comments rather than only structured survey responses. Some comments are also highly opinionated or written as part of ongoing conflict between users and moderators. However, the material is still valuable as qualitative observation data because it reveals how users talk about polarization, moderation, trust, and discussion quality in a real community context.

## Next step

Use these insights to define measurable indicators for the prototype. The strongest indicators to test first are:

- Toxicity / personal attack language
- Ad hominem or labeling of opponents
- Emotionally loaded “us vs them” phrasing
- Low-effort baiting signals
- Rapid increase in reports or comment activity
- Thread-level escalation over time
