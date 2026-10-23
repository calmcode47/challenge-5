import { Link } from "react-router";
import { Button } from "../../components/ui/Button";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

/**
 * 404 Not Found route fallback page.
 *
 * @returns JSX.Element
 */
export default function NotFoundPage(): JSX.Element {
  useDocumentTitle("Page Not Found");

  return (
    <section className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="mb-4 text-4xl sm:text-6xl font-bold font-display tracking-wide uppercase text-[var(--color-text)]">
        Page Not Found
      </h1>
      <p className="max-w-md text-base text-[var(--color-muted)] mb-8 leading-relaxed">
        We could not locate the page you requested. The plan or route may have moved or expired.
      </p>
      <Link to="/" className="outline-none">
        <Button variant="primary">Return Home</Button>
      </Link>
    </section>
  );
}
