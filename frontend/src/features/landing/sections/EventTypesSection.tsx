import { Cake, Heart, Users } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotionPref } from "../../../hooks/useReducedMotionPref";
import { TiltCard } from "../components/TiltCard";
import { LANDING_COPY, type EventTypeCopy } from "../copy";

const eventIcons: Record<EventTypeCopy["id"], JSX.Element> = {
  wedding: <Heart className="w-3.5 h-3.5" aria-hidden="true" />,
  birthday: <Cake className="w-3.5 h-3.5" aria-hidden="true" />,
  community: <Users className="w-3.5 h-3.5" aria-hidden="true" />,
};

/**
 * Event Types selection section offering 3 interactive tilt cards
 * preselecting the event archetype in the wizard.
 *
 * @returns JSX.Element
 */
export function EventTypesSection(): JSX.Element {
  const prefersReduced = useReducedMotionPref();
  const copy = LANDING_COPY.eventTypes;

  const containerVariants = {
    hidden: { opacity: prefersReduced ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: prefersReduced ? 0 : 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="event-types"
      aria-labelledby="event-types-heading"
      className="py-16 sm:py-24 space-y-12"
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 600px" }}
    >
      <div className="max-w-3xl space-y-4">
        <h2
          id="event-types-heading"
          className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-wide text-[var(--color-text)]"
        >
          {copy.sectionTitle}
        </h2>
        <p className="text-base sm:text-lg text-[var(--color-muted)] leading-relaxed">
          {copy.sectionSubtitle}
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {copy.cards.map((card) => (
          <motion.div key={card.id} variants={itemVariants}>
            <TiltCard
              to={`/plan/new?type=${card.id}`}
              title={card.title}
              tagline={card.tagline}
              whatYouGet={card.whatYouGet}
              accentColor={card.accentColor}
              badgeText={card.badgeText}
              icon={eventIcons[card.id]}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
