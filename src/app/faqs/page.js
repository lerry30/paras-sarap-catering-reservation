import Footer from '@/components/Footer';
import CNavbar from '@/components/client/nav/CNavbar';

const FAQS = () => {
    return <div className="pt-[var(--nav-height)]">
        <CNavbar/>
        <div className="px-page-x py-8">
            <h1 className="font-headings text-xl font-bold sm:mb-4">FAQs</h1>

            <ol className="space-y-8 list-decimal list-inside font-semibold font-headings">
                <li>
                    How do I make a reservation for my event?
                    <p className="text-xl !font-thin !font-paragraphs">To make a reservation, simply select your desired package or customize your own. Once you’ve made your choice, click the "Reserve Now" button and complete the booking form. Our team will contact you to confirm the details.</p>
                </li>
                <li>
                    Can I customize my catering package?
                    <p className="text-xl !font-thin !font-paragraphs">Absolutely! We offer flexible options so you can tailor the menu, themes, and services to suit your event’s unique needs. Just select the customization option during booking.</p>
                </li>
                <li>
                    What types of events do you cater to?
                    <p className="text-xl !font-thin !font-paragraphs">We cater to a wide range of events, including weddings, corporate events, birthdays, anniversaries, and more. Whether you’re hosting an intimate gathering or a large celebration, we’ve got you covered.</p>
                </li>
                <li>
                    What is included in the wedding packages?
                    <p className="text-xl !font-thin !font-paragraphs">Our wedding packages include a variety of themes, menu combinations, and venue options. You can choose from our curated selections or customize the package to fit your preferences, including décor, dishes, and special services.</p>
                </li>
                <li>
                    Do you provide options for special dietary needs?
                    <p className="text-xl !font-thin !font-paragraphs">Yes, we offer a range of menu options for guests with dietary restrictions, including vegetarian, vegan, gluten-free, and allergy-friendly dishes. Let us know your requirements during the reservation process.</p>
                </li>
                <li>
                    How far in advance should I book my event?
                    <p className="text-xl !font-thin !font-paragraphs">We recommend booking as early as possible to secure your desired date, especially during peak wedding and event seasons. For weddings, a reservation at least 6 months in advance is ideal, but we accommodate shorter timelines based on availability.</p>
                </li>
                <li>
                    Can I visit the venue before making a reservation?
                    <p className="text-xl !font-thin !font-paragraphs">Yes, we offer venue tours for all prospective clients. Contact us to schedule a visit, and we’ll be happy to show you around and discuss your event details in person.</p>
                </li>
                <li>
                    What payment methods do you accept?
                    <p className="text-xl !font-thin !font-paragraphs">We accept various payment methods, including credit/debit cards, bank transfers, and online payment platforms. You’ll be able to choose your preferred method during the checkout process.</p>
                </li>

                <li>
                    Is there a deposit required for reservations?
                    <p className="text-xl !font-thin !font-paragraphs">Yes, a deposit is required to secure your reservation. The deposit amount will vary depending on the package and services selected. Full payment details will be provided during the booking process.</p>
                </li>
                <li>
                    What happens if I need to cancel or reschedule my reservation?
                    <p className="text-xl !font-thin !font-paragraphs">We understand that plans may change. Please review our cancellation and rescheduling policies in the Terms and Conditions section of our website, or contact our customer service team for assistance.</p>
                </li>
                <li>
                    Can I request a tasting before I book my event?
                    <p className="text-xl !font-thin !font-paragraphs">Yes! We offer tastings for couples or event organizers to sample dishes before making a decision. Schedule a tasting by contacting our team.</p>
                </li>
                <li>
                    What are the available venues and themes?
                    <p className="text-xl !font-thin !font-paragraphs">We have partnerships with a variety of venues, each offering different themes and ambiances. You can explore venue options on our website or inquire about them during your reservation process.</p>
                </li>
            </ol>
        </div>
        <Footer />
    </div>
}

export default FAQS;
