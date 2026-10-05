import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { formatPrice, offerNote, pricing } from "@/lib/pricing";

export type TermBlock = { id: string } & (
  | { type: "title" | "microtitle" | "paragraph" | "note"; content: ReactNode }
  | { type: "list"; title: string; items: ReactNode[] }
);

export const contentData: Record<string, TermBlock[]> = {
  Prices: [
    {
      id: "term-1",
      type: "title",
      content: "Prices",
    },
    {
      id: "term-2",
      type: "list",
      title: `- Logo Design ${formatPrice(pricing.logo.amount)} USD${offerNote(pricing.logo)}`,
      items: [
        "Single Payment",
        "No limit of design approaches or revisions",
        "High-quality editable vector files",
        "Additional editable .psd files",
        "Vault Service",
        "Follow-up after the project is completed",
        "All Commercial Rights",
        "All Media Uses Allowed",
      ],
    },
    {
      id: "term-3",
      type: "microtitle",
      content: `- Business Card Design ${formatPrice(pricing.businessCards.amount)} USD${offerNote(pricing.businessCards)} (Subject to availability)`,
    },
    {
      id: "term-4",
      type: "microtitle",
      content: `- Priority Projects additional ${formatPrice(pricing.priority.amount)} USD${offerNote(pricing.priority)} (Subject to availability) (Receive the first design approach within 72 hrs)`,
    },
    {
      id: "term-5",
      type: "note",
      content:
        "IMPORTANT NOTE: The cost may increase if the workload exceeds the amount of a usual project. For further information please read the SERVICE section.",
    },
  ],
  Payment: [
    {
      id: "term-6",
      type: "title",
      content: "Payment",
    },
    {
      id: "term-7",
      type: "paragraph",
      content: (
        <Fragment>
          To request a commission you will need to make a full payment of{" "}
          <b className="inline-space">{formatPrice(pricing.logo.amount)} USD</b>
          , only then the project will be considered
          <b className="inline-space">&quot;active&quot;</b>. I only accept
          payments through <b className="inline-space">Paypal</b>.
        </Fragment>
      ),
    },
    {
      id: "term-8",
      type: "paragraph",
      content: (
        <Fragment>
          I will require your email tied to Paypal to send you an invoice that
          comes with <b className="inline-space">Terms and Conditions</b> of the
          service provided.
        </Fragment>
      ),
    },
    {
      id: "term-9",
      type: "note",
      content:
        "IMPORTANT NOTE: Please don’t send any payment without receiving an invoice first.",
    },
  ],
  Cancellations_and_Refunds: [
    {
      id: "term-10",
      type: "title",
      content: "Cancellations & Refunds",
    },
    {
      id: "term-11",
      type: "paragraph",
      content: (
        <Fragment>
          The payment is{" "}
          <b className="inline-space">
            nonrefundable after the first design approach is sent.
          </b>{" "}
          Before then, the client can request a full refund
          <b className="inline-space">(Transaction fees not included).</b>
        </Fragment>
      ),
    },
    {
      id: "term-12",
      type: "paragraph",
      content: (
        <Fragment>
          A project is considered <b className="inline-space">abandoned</b> if
          the designer doesn&quot;t receive a reply within
          <b className="inline-space">10 days</b> after the last communication
          with the client.
        </Fragment>
      ),
    },
    {
      id: "term-13",
      type: "note",
      content: `IMPORTANT NOTES: A project canceled because of abandonment isn't entitled to a refund.`,
    },
  ],
  WorkProcess: [
    {
      id: "term-14",
      type: "title",
      content: "Work Process",
    },
    {
      id: "term-15",
      type: "paragraph",
      content: (
        <Fragment>
          Please send an email to
          <Link
            href="mailto:commissions@whitefoxdesigns.net"
            className="inline-space"
          >
            commissions@whitefoxdesigns.net
          </Link>
          ,
          <Link
            href="https://twitter.com/WhiteFoxDesign2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-space"
          >
            Twitter DM
          </Link>
          , or Discord
          <Link
            href="https://discordapp.com/users/113042224987525120"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-space"
          >
            @whitefox.designs
          </Link>
          with the following information:
        </Fragment>
      ),
    },
    {
      id: "term-16",
      type: "list",
      title: "For Logos:",
      items: [
        "Name of the Project or Text that will go on the design.",
        <Fragment key={0}>
          Name of the owner of the copyrights (Full Name, Company Name or Social
          Media alias)
          <b className="inline-space">
            This name will be referenced by the designer on his online
            portfolios.
          </b>
        </Fragment>,
        <Fragment key={0}>
          Information about the company, service, character, or any other
          pertinent information and resources required for the realization of
          the design.
          <b className="inline-space">
            Please make sure you have full rights over all characters, fonts,
            and colors you request to be part of your design.
          </b>
        </Fragment>,
        "Specify what you want for the design (image, text, or text and image)",
        <Fragment key={0}>
          If possible provide an example of logo designs that you like. Look at
          my gallery and sites like <b className="inline-space">Dribble</b> and
          <b className="inline-space">Logopond</b> for inspiration.
        </Fragment>,
        <Fragment key={0}>
          Please tell me if you need a specific color or palette of colors in
          your logo. Especially if you require a
          <b className="inline-space">PANTONE</b> for printing.{" "}
          <b className="inline-space">(I do not provide PANTONES)</b>
        </Fragment>,
        <Fragment key={0}>
          Set a deadline for the conclusion of the project. Please consider a{" "}
          <b className="inline-space">
            minimum of four weeks is required after the project has started.
          </b>
        </Fragment>,
        "An email address linked to Paypal.",
        <Fragment key={0}>
          Please specify if you wish to use the{" "}
          <b className="inline-space">Vault Service</b> if you wish for the logo
          to not be displayed publicly.
        </Fragment>,
      ],
    },
    {
      id: "term-17",
      type: "list",
      title: "For Business Cards:",
      items: [
        "Size",
        "If it the card will have one or two sides",
        "Details that you want to be included in the card (Logo, Name, Address, Contact info, ect)",
        "Specify what you want for the design (image, text, or text and image)",
        "Additional details you want (colors, shape not rectangular, additional tints, etc)",
      ],
    },
    {
      id: "term-18",
      type: "note",
      content:
        "NOTE: If there are prior projects in progress, there can be a delay of one or more weeks before I can start your project.",
    },
    {
      id: "term-19",
      type: "note",
      content:
        "NOTE: If you wish to Commission a logo but you aren't sure of what you want please feel free to send a note and request an Advisory. It doesn't have a cost.",
    },
    {
      id: "term-20",
      type: "list",
      title: "Once the project starts the designer will provide with:",
      items: [
        "An initial design approach. It can be one or more cleaned designs (No sketches)",
        <Fragment key={0}>
          Frequent updates based on the client&apos;s speed of response and
          changes requested. All updates are on .jpg files of 25% of the actual
          size of the design.{" "}
          <b className="inline-space">
            No high-resolution images are provided at this stage.
          </b>
        </Fragment>,
        "Varied options for the design like black and white, single-color, icon only, text only, etc.",
        "When a design is approved the designer will provide the original vector files and other formats requested. ",
      ],
    },
  ],
  Please_Dont: [
    {
      id: "term-21",
      type: "title",
      content: "Please Don't Do The Following",
    },
    {
      id: "term-22",
      type: "paragraph",
      content:
        "Request design approaches so you can compare them with other designers and decide if you wish to hire me or not. If you wish to do this please don't bother contacting me.",
    },
    {
      id: "term-23",
      type: "paragraph",
      content:
        "Please don't request new design approaches without giving feedback. I don't limit the number of design approaches or revisions but that doesn't mean I will make as many as you wish.",
    },
  ],
  Service: [
    {
      id: "term-24",
      type: "title",
      content: "Service",
    },
    {
      id: "term-25",
      type: "microtitle",
      content: "No limit of design approaches or revisions",
    },
    {
      id: "term-26",
      type: "paragraph",
      content:
        "Most design services offer only three design approaches and two changes. I don't like that system, I find it too limiting for both the client and the designer, so instead, I usually start doing one or two design approaches to see what are your preferences. Then I polish either approach or make a new one. I keep making changes until you are happy with the design and I don't charge any additional fee per design.",
    },
    {
      id: "term-27",
      type: "note",
      content:
        "NOTE: This doesn't mean I will keep doing design approaches infinitely, there is a time limit to ask for changes. That time is a full day of work. If I consider the project is not moving forward or the amount of work have exceeded the time, I will contact you and ask you if you wish to continue but with an additional fee. I won't charge any additional fee without previous notice. Time counts ONLY when working on the design approaches and changes, not while waiting.",
    },
    {
      id: "term-28",
      type: "note",
      content:
        "IMPORTANT NOTE: If the project doesn't move forward the designer and the client can agree in a cancelation. The client will receive a refund and in exchange they agree to not keep nor share any of the design approaches received and the designer has full ownership over the designs provided.",
    },
    {
      id: "term-29",
      type: "microtitle",
      content: "High-quality editable vector files",
    },
    {
      id: "term-30",
      type: "paragraph",
      content:
        "I work on Adobe Illustrator (Version CS6) which is the best tool for logo design. Why? Because you can make vector files. Vector files allow you to resize the design without any repercussions, it's easier to change colors and select specific parts of the design to alter. Many designers don't offer these files because that way clients will feel compelled to come back whenever they need a change in the design and they can charge for it.",
    },
    {
      id: "term-31",
      type: "microtitle",
      content: "Additional editable .psd files",
    },
    {
      id: "term-32",
      type: "paragraph",
      content:
        "Usually, most of my client's requests a .PSD (Adobe Photoshop) and .PNG files. I also provide any other kind of files you require as long as I possess the program and exporting is possible. I don't charge any additional fees for this.",
    },
    {
      id: "term-33",
      type: "microtitle",
      content: "Vault Service",
    },
    {
      id: "term-34",
      type: "paragraph",
      content:
        "The vault is a service you can request to keep your design in storage, which means I won't display it on my online portfolios.",
    },
    {
      id: "term-35",
      type: "microtitle",
      content: "Follow-up after the project is completed",
    },
    {
      id: "term-36",
      type: "paragraph",
      content:
        "You can request new files and minor changes (Color and Text if it's editable) anytime without cost. Also, I keep a backup of all the files I send you in case you lose them. Still, I recommend you to be careful with them in case something happened to me.",
    },
    {
      id: "term-37",
      type: "note",
      content:
        "NOTE: You won't be able to request new files or minor changes if I find compelling evidence of you violating my Author Moral Rights.",
    },
    {
      id: "term-38",
      type: "microtitle",
      content: "All Commercial Rights",
    },
    {
      id: "term-39",
      type: "paragraph",
      content:
        "This is related to the last point. Some designers charge for each possible use of a design. They charge for printing, web, video, app, billboards, etc. I don't do that, once you paid me you can do whatever you want with your design without a need to tell me. You can sell it or modify it. I only keep the Author Rights which allows me to say I made the design and display it in my portfolios.",
    },
    {
      id: "term-40",
      type: "note",
      content:
        "NOTE: The Author Moral Rights aren't for sale. This means you can't claim you made any of my designs even if you request the Vault Service. This doesn't apply to those designs where I was hired to only trace them into vectors or further redesigns of the design I made.",
    },
    {
      id: "term-41",
      type: "microtitle",
      content: "No Limitations of Use",
    },
    {
      id: "term-42",
      type: "paragraph",
      content:
        "You can use the logo unlimited times and in any media you want without requiring my permission or with an additional cost, even if you didn't clarify how you would use the design at the start of the project.",
    },
    {
      id: "term-43",
      type: "note",
      content:
        "NOTE: If someone contacts you requesting a fee for using your logo on websites like Youtube, Tiktok, Instagram, etc. Please know IT IS NOT ME. Feel free to contact me if you require proof or purchase so you can combat a DMCA or other malicious actions. Keep your PayPal invoice since all Terms of Service are on it.",
    },
    {
      id: "term-44",
      type: "microtitle",
      content: "No additional cost for businesses",
    },
    {
      id: "term-45",
      type: "paragraph",
      content:
        "I give my 100% for each project, no matter the client. Same service for everyone, same cost.",
    },
    {
      id: "term-46",
      type: "microtitle",
      content: "Trust and Expertise",
    },
    {
      id: "term-47",
      type: "paragraph",
      content:
        "This point can be subjective but nonetheless is an essential part of my work. 10 years and more than 1500 successful projects can be evidence of my experience and dedication to giving a good service to my clients.",
    },
    {
      id: "term-48",
      type: "paragraph",
      content: (
        <Fragment>
          You can also visit my
          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="inline-space"
            href={"http://fav.me/ddhazrl"}
          >
            Service Review
          </Link>
          to see the comments left by some clients.
        </Fragment>
      ),
    },
    {
      id: "term-49",
      type: "microtitle",
      content: "Postponed projects",
    },
    {
      id: "term-50",
      type: "paragraph",
      content: (
        <Fragment>
          The client can request to{" "}
          <b className="inline-space">postpone a project for one month.</b> If
          the client restarts the project within the set time they won&apos;t
          require paying the advance payment again.
        </Fragment>
      ),
    },
    {
      id: "term-51",
      type: "microtitle",
      content: "Intellectual Property Rights",
    },
    {
      id: "term-52",
      type: "paragraph",
      content: (
        <Fragment>
          This is a professional service. All designs are protected under the
          <b className="inline-space">
            Digital Millennium Copyright Act, the Creative Commons, and the
            Intelectual Property Rights
          </b>{" "}
          of each country where these designs are registered by their rightful
          owners. If you try to use one of these designs without permission you
          may be subject to legal actions.
        </Fragment>
      ),
    },
    {
      id: "term-53",
      type: "microtitle",
      content: "What happens in the case of Multiple Discovery?",
    },
    {
      id: "term-54",
      type: "paragraph",
      content: (
        <Fragment>
          In the case of a <b className="inline-space">Multiple Discovery</b>{" "}
          (When inventions are made independently by multiple people), the
          client can request a new design but only if it&apos;s{" "}
          <b className="inline-space">
            within 2 months after finishing the commission.
          </b>
        </Fragment>
      ),
    },
    {
      id: "term-55",
      type: "list",
      title: "TERMS AND CONDITIONS OF THE SERVICE",
      items: [
        "The client agrees to cover the full fee to start the project.",
        "The client is responsible for all resources they provide to be used on their project. The designer is not liable in case those resources are stolen or have limited commercial rights.",
        "The designer can't keep nor share any of the resources provided by the client to be used on their project.",
        "The client can't keep nor share any design approaches with other designers or artists to replicate or modify.",
        "Once the client receives the final files (.ai, .eps, .psd, and other requested formats), the client accepts he/she/they are satisfied with the design provided and the price established.",
        "There are no refunds once the first design approach is sent.",
        "The client can request minor changes to the design any time he/she/they desire.",
        "The client can request new files anytime he/she/they desire.",
        "The client has full commercial ownership of the design with all the rights it entails.",
        "The designer keeps the author's moral rights to promote and display the work as made by him.",
        "The client can't promote himself/herself/themselves as the creators of the design.",
        "All unused design approaches belong to the designer.",
        "The designer can re-use, recycle, modify, share or sell any unused design approaches that aren't variants of the chosen design.",
        "The client can redesign, modify or alter the design in any way he/she wants. The designer will only keep the author's rights over the original design.",
      ],
    },
  ],
  Commonly_asked_questions: [
    {
      id: "term-56",
      type: "title",
      content: "Commony asked questions",
    },
    {
      id: "term-57",
      type: "microtitle",
      content: "Can I use the logo I commissioned on other websites?",
    },
    {
      id: "term-58",
      type: "paragraph",
      content:
        "Absolutely yes. You can use the logo however you want. The logo is an identity and as an identity, you can use it in any way you feel is right to identify yourself.",
    },
    {
      id: "term-59",
      type: "microtitle",
      content: "Can I commercialize the design?",
    },
    {
      id: "term-60",
      type: "paragraph",
      content:
        "Yes. All commercial rights belong to you the moment you pay me. That's why I send the original editable files. While you commercialize the design, you can't promote yourself as the creator of the design.",
    },
    {
      id: "term-61",
      type: "microtitle",
      content: "Can I resell the design?",
    },
    {
      id: "term-62",
      type: "paragraph",
      content:
        "Yes. As mentioned before you own all commercial rights, including selling the identity. But keep in mind that you can't violate my author's moral rights, which means you can't promote yourself as the author of the design neither the new buyer, nor you can agree with a third party to pull down all images containing the design, including those on my portfolios.",
    },
    {
      id: "term-63",
      type: "microtitle",
      content: `Can I purchase the author's moral rights?`,
    },
    {
      id: "term-64",
      type: "paragraph",
      content:
        "No, but you can request the Vault Service so the design won't be displayed in my portfolios. Still, this doesn't mean that you can claim you made the design but you don't have to tell others I did it.   ",
    },
  ],
};
