export interface Blog {
    id: string;
    title: string;
    image: string | null;
    published_at: string | null;
    content: string;
    href?: string; // For static chronicles
    isStatic?: boolean;
}

export const staticChronicles: Blog[] = [
    {
        id: "the-festivitas-of-oil",
        title: "The Festivitas of Oil",
        image: "/festivitas_of_oil.png",
        published_at: "2026-02-08",
        content: "One thousand amphorae of oil. A pool filled at the Montague Baths. The host takes the fall. The guests go home. And the Empire keeps turning, slick and unbothered.",
        href: "/chronicle/the-festivitas-of-oil",
        isStatic: true,
    },
    {
        id: "the-scrolls-of-the-island",
        title: "The Scrolls of the Island",
        image: "/scrolls_of_the_island.png",
        published_at: "2026-02-06",
        content: "The Praetorian Guard released 3.5 million scrolls. The redactions used washable ink. The powerful got protection. The victims got none. Nothing happens. Nothing was ever going to happen.",
        href: "/chronicle/the-scrolls-of-the-island",
        isStatic: true,
    },
    {
        id: "the-war-of-the-oracles",
        title: "The War of the Oracles",
        image: "/war_of_the_oracles.png",
        published_at: "2026-02-05",
        content: "Consul Altmanius is 'exceptionally testy.' The Anthropic faction bought time during the Festival of the Superb Owl. The bread is expensive. The circuses are sponsored by venture capital.",
        href: "/chronicle/the-war-of-the-oracles",
        isStatic: true,
    },
    {
        id: "the-department-of-imperial-efficiency",
        title: "The Department of Imperial Efficiency",
        image: "/department_of_imperial_efficiency.png",
        published_at: "2026-02-02",
        content: "The Emperor has appointed Merchant Elonius to the new Department of Imperial Efficiency. His first act? Firing the Aqueduct Guild.",
        href: "/chronicle/the-department-of-imperial-efficiency",
        isStatic: true,
    },
    {
        id: "the-return-to-office",
        title: "The Return to Office",
        image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=500&fit=crop",
        published_at: "2026-02-01",
        content: "The Forum was remodeled, the banners were hung, and the Senate declared the return mandatory. Remote work, they said, was destroying the culture.",
        href: "/chronicle/the-return-to-office",
        isStatic: true,
    },
    {
        id: "the-all-hands-meeting",
        title: "The All-Hands Meeting",
        image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&h=500&fit=crop",
        published_at: "2026-01-31",
        content: "The horn sounded at the third hour. Attendance was mandatory. Enthusiasm was expected. Comprehension was optional.",
        href: "/chronicle/the-all-hands-meeting",
        isStatic: true,
    },
    {
        id: "the-performance-review",
        title: "The Performance Review",
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=500&fit=crop",
        published_at: "2026-01-30",
        content: "Marcus had survived twelve quarters. In the arena, they called him Marcellus the Adequate — not because he was merely adequate, but because adequacy was the highest praise the Senate would allow.",
        href: "/chronicle/the-performance-review",
        isStatic: true,
    },
];

export const getPublishedChronicles = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return staticChronicles.filter((c) => {
        if (!c.published_at) return true;
        return new Date(c.published_at + "T00:00:00") <= today;
    });
};
