import ContactPage from "@/components/contact/ContactPage";

export const metadata = {
  title: "Contact — CreativeCue",
  description: "Book a call and let's build something great together.",
};

export default function ContactRoute() {
  return (
    <div className="showcase-view showcase-view--scrollable contact-route">
      <ContactPage />
    </div>
  );
}
