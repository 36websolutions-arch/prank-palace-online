# Email & SMS Campaign Plan — "You Smell Like Shit" Cologne

## Overview
Post-purchase email sequences + seasonal re-engagement campaigns to upsell buyers, drive repeat purchases, and leverage SMS affiliate channel.

---

## 1. Post-Purchase Email Sequence

### Email 1: Order Confirmation (Immediate)
**Subject:** Your roast is on its way.
**Preview:** Order confirmed. Your friend has no idea what's coming.

**Body:**
- Order summary (product, scent, card message selected)
- Estimated delivery date
- "What happens next" timeline (ships in 24hrs → arrives in 3-5 days → they open it → chaos)
- Subtle upsell: "Forgot someone? Grab another pack → [link]"
- Social share CTA: "Tell the group chat what you did"

---

### Email 2: Shipped Notification (When shipped)
**Subject:** It's in the mail. No turning back now.
**Preview:** Your gift is officially en route. The countdown begins.

**Body:**
- Tracking info
- "The card says: [preview of their selected card front message]"
- Countdown graphic to estimated delivery
- "Want to roast more people? Bundle 2+ for free shipping → [link]"

---

### Email 3: Delivery Confirmation / Reaction Prompt (Delivery day + 1)
**Subject:** So... did they open it yet?
**Preview:** We need to know what happened.

**Body:**
- "Your package was delivered yesterday. We need details."
- CTA: "Tell us their reaction" → links to a quick form or social share
- "Film the reaction and tag us for a chance to be featured"
- Social proof: "Join 2,800+ people who've sent this gift"
- Upsell: "Round 2? Your other friends are still stinky → [link]"

---

### Email 4: Follow-Up (Delivery + 5 days)
**Subject:** They're still talking about it.
**Preview:** One gift. Maximum impact. Who's next?

**Body:**
- "By now your friend either loves you or hates you. Either way, they smell better."
- Bundle deal pitch: "Send to 2 more friends — save $10 + free shipping"
- Review request: "Drop a review and help other roasters decide → [link]"
- Referral hook: "Share your unique link — earn $5 off your next order for every friend who buys"

---

### Email 5: Win-Back (14 days post-purchase)
**Subject:** Your friends still smell.
**Preview:** Just saying. We checked.

**Body:**
- Light humor: "We ran the numbers. Statistically, you have at least 3 more friends who need this."
- 15% off code for repeat purchase: `STILLSTINKY15`
- Bundle reminder: 3-pack = best value
- "New scent packs dropping soon — be first to know"

---

## 2. SMS Campaign (via Affiliate Push)

**NOTE:** SMS has higher drop-off. Keep messages short, punchy, value-forward. Max 2-3 texts per customer. Always include opt-out.

### SMS 1: Delivery Day
```
Your "You Smell Like Shit" gift just landed. 💀 We need to know their reaction. Reply with the story or tag us @corporatepranks

Reply STOP to opt out
```

### SMS 2: 3 Days Post-Delivery
```
Still got stinky friends? 🧴 Grab another pack — use code STINKY15 for 15% off. Free shipping on 2+. corporatepranks.com/you-smell-like-shit

Reply STOP to opt out
```

### SMS 3: Seasonal (only send during campaign windows below)
```
[Holiday name] is coming. You know what that means. 🎁 The gag gift that actually smells good — corporatepranks.com/you-smell-like-shit

Reply STOP to opt out
```

---

## 3. Seasonal Re-Engagement Campaigns

### April Fools' Day (Send: March 25-28)
**Subject:** April Fools' is coming. Your friends aren't ready.
**Preview:** The perfect prank gift. Actually smells amazing.

**Body:**
- "April 1st is the one day you're SUPPOSED to be savage."
- "Send the ultimate gag gift — cologne that says what everyone's thinking."
- Limited-time April Fools bundle: 3-pack for $44.99 (save $15)
- Code: `APRIL3PACK`
- Urgency: "Order by March 28 for guaranteed April 1st delivery"

---

### Valentine's Day (Send: Feb 7-10)
**Subject:** Roses are red. You smell like shit.
**Preview:** The anti-Valentine's gift for your favorite person.

**Body:**
- Card message #7 featured: "Roses are red, violets are blue, you smell like shit, this cologne's for you."
- "Skip the boring chocolates. Send something they'll actually remember."
- Valentine's bundle: 2-pack with custom card for $29.99
- Code: `BEMINE`

---

### Christmas / Holiday Season (Send: Nov 20-25)
**Subject:** The gift they didn't ask for (but definitely need).
**Preview:** White elephant champion. Secret Santa destroyer.

**Body:**
- "Tired of buying the same boring gifts? This year, go legendary."
- Position as the perfect White Elephant / Secret Santa / Yankee Swap gift
- Holiday 3-pack deal: $44.99 + free shipping + free gift wrap
- Code: `HOLIDAY3`
- Urgency: "Order by Dec 15 for guaranteed Christmas delivery"
- Gift guide format: "For your brother ($19.99) → For the whole group chat ($49.99)"

---

### Father's Day (Send: June 5-10)
**Subject:** Dad jokes? Nah. Dad roasts.
**Preview:** Tell your dad the truth this year. Then give him cologne.

**Body:**
- "Your dad has been using the same cologne since 1997. It's time."
- Card message #9 featured: "I Love You But... I can't keep pretending you smell good."
- Father's Day special: 1-pack + custom card for $17.99
- Code: `DADSMELLS`

---

### Birthdays (Triggered: if we collect birthday data)
**Subject:** It's [name]'s birthday. You know what to do.
**Preview:** The birthday gift that keeps on roasting.

**Body:**
- "Another year older. Still smells the same."
- Birthday-themed card options highlighted
- 10% off birthday order: `BDAY10`

---

## 4. Referral Program (Future)

- Each buyer gets a unique referral link
- Referee gets 10% off first order
- Referrer gets $5 credit per conversion
- Tracked via UTM params + Supabase
- Referral email sent in Email 4 (delivery + 5 days)

---

## 5. Metrics to Track

| Metric | Target |
|--------|--------|
| Post-purchase open rate | 45%+ |
| Post-purchase click rate | 8%+ |
| Repeat purchase rate (30 days) | 12%+ |
| SMS opt-out rate | < 15% per message |
| Seasonal campaign revenue | $500+ per campaign |
| Referral conversion rate | 5%+ |
| Average order value (repeat) | $34.99+ (2-pack) |

---

## 6. Tools Needed

- **Email:** Resend, SendGrid, or Loops (transactional + marketing)
- **SMS:** Affiliate's platform (get API access for triggered sends)
- **Automation:** Supabase Edge Functions for triggers (order created → email 1, shipped → email 2, etc.)
- **Tracking:** UTM params on all links, GA4 events, Supabase for conversion data

---

## Implementation Priority

1. **Now:** Post-purchase emails 1-4 (manual via Resend or similar)
2. **Next:** SMS 1-2 via affiliate
3. **Before April:** April Fools' campaign
4. **Q4:** Holiday campaign + referral program
