const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const User = require("./src/models/user");
const ConnectionRequest = require("./src/models/connectionRequest");
const Message = require("./src/models/message");
const Notification = require("./src/models/notification");

const DEFAULT_PASSWORD = "DevPass123!";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI is not set");
  await mongoose.connect(mongoUri);
  console.log("MongoDB Connected Successfully");
};

const dummyUsers = [
  {
    firstName: "Demo",
    lastName: "User",
    email: "demo@example.com",
    password: "DemoUser123!",
    age: 24,
    gender: "male",
    city: "Mumbai",
    about: "Full-stack dev building side projects. Looking for hackathon teammates and open-source collaborators.",
    skills: ["JavaScript", "React", "Node.js", "TypeScript"],
    photoUrl: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    firstName: "Ananya",
    lastName: "Desai",
    email: "ananya@example.com",
    age: 23,
    gender: "female",
    city: "Mumbai",
    about: "React developer passionate about design systems and accessible UI.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Figma"],
    photoUrl: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    firstName: "Arjun",
    lastName: "Mehta",
    email: "arjun@example.com",
    age: 27,
    gender: "male",
    city: "Bangalore",
    about: "Backend engineer scaling microservices. Open to co-founder conversations.",
    skills: ["Node.js", "Go", "PostgreSQL", "Docker"],
    photoUrl: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    firstName: "Kavya",
    lastName: "Reddy",
    email: "kavya@example.com",
    age: 25,
    gender: "female",
    city: "Hyderabad",
    about: "ML engineer exploring GenAI apps. Hackathon enthusiast.",
    skills: ["Python", "TensorFlow", "AWS", "FastAPI"],
    photoUrl: "https://randomuser.me/api/portraits/women/13.jpg",
  },
  {
    firstName: "Rohan",
    lastName: "Iyer",
    email: "rohan@example.com",
    age: 29,
    gender: "male",
    city: "Pune",
    about: "DevOps lead automating everything. Looking for side project partners.",
    skills: ["Kubernetes", "AWS", "Terraform", "Linux"],
    photoUrl: "https://randomuser.me/api/portraits/men/14.jpg",
  },
  {
    firstName: "Sneha",
    lastName: "Joshi",
    email: "sneha@example.com",
    age: 26,
    gender: "female",
    city: "Mumbai",
    about: "Mobile dev (React Native). Building a fitness app on weekends.",
    skills: ["React Native", "JavaScript", "Firebase", "Redux"],
    photoUrl: "https://randomuser.me/api/portraits/women/15.jpg",
  },
  {
    firstName: "Dev",
    lastName: "Patel",
    email: "dev.patel@example.com",
    age: 22,
    gender: "male",
    city: "Ahmedabad",
    about: "CS student learning full-stack. Want to join open-source projects.",
    skills: ["JavaScript", "React", "MongoDB"],
    photoUrl: "https://randomuser.me/api/portraits/men/16.jpg",
  },
  {
    firstName: "Ishita",
    lastName: "Nair",
    email: "ishita@example.com",
    age: 24,
    gender: "female",
    city: "Chennai",
    about: "Frontend dev at a startup. Love animations and micro-interactions.",
    skills: ["Vue.js", "CSS", "Framer Motion", "JavaScript"],
    photoUrl: "https://randomuser.me/api/portraits/women/17.jpg",
  },
  {
    firstName: "Karan",
    lastName: "Malhotra",
    email: "karan@example.com",
    age: 31,
    gender: "male",
    city: "Delhi",
    about: "Senior engineer mentoring juniors. Interested in ed-tech side projects.",
    skills: ["Java", "Spring Boot", "System Design", "AWS"],
    photoUrl: "https://randomuser.me/api/portraits/men/18.jpg",
  },
  {
    firstName: "Lakshmi",
    lastName: "Rao",
    email: "lakshmi@example.com",
    age: 28,
    gender: "female",
    city: "Bangalore",
    about: "Data engineer building pipelines. Looking for hackathon team.",
    skills: ["Python", "Spark", "SQL", "Airflow"],
    photoUrl: "https://randomuser.me/api/portraits/women/19.jpg",
  },
  {
    firstName: "Manish",
    lastName: "Verma",
    email: "manish@example.com",
    age: 30,
    gender: "male",
    city: "Jaipur",
    about: "Blockchain curious full-stack dev. Building Web3 experiments.",
    skills: ["Solidity", "React", "Node.js", "Ethereum"],
    photoUrl: "https://randomuser.me/api/portraits/men/20.jpg",
  },
  {
    firstName: "Divya",
    lastName: "Krishnan",
    email: "divya@example.com",
    age: 27,
    gender: "female",
    city: "Kochi",
    about: "QA turned automation engineer. Love clean code and testing culture.",
    skills: ["Selenium", "Cypress", "JavaScript", "CI/CD"],
    photoUrl: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    firstName: "Harsh",
    lastName: "Agarwal",
    email: "harsh@example.com",
    age: 26,
    gender: "male",
    city: "Lucknow",
    about: "Competitive programmer exploring product engineering roles.",
    skills: ["C++", "Python", "Algorithms", "React"],
    photoUrl: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    firstName: "Isha",
    lastName: "Banerjee",
    email: "isha@example.com",
    age: 25,
    gender: "female",
    city: "Kolkata",
    about: "UX engineer bridging design and code. Side project: dev tools SaaS.",
    skills: ["React", "Figma", "Design Systems", "TypeScript"],
    photoUrl: "https://randomuser.me/api/portraits/women/23.jpg",
  },
  {
    firstName: "Jay",
    lastName: "Choudhury",
    email: "jay@example.com",
    age: 23,
    gender: "male",
    city: "Goa",
    about: "Digital nomad dev. Building indie SaaS and looking for collaborators.",
    skills: ["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS"],
    photoUrl: "https://randomuser.me/api/portraits/men/24.jpg",
  },
  {
    firstName: "Kavita",
    lastName: "Menon",
    email: "kavita@example.com",
    age: 29,
    gender: "female",
    city: "Pune",
    about: "Cloud architect helping startups migrate to AWS. Mentorship available.",
    skills: ["AWS", "Azure", "Kubernetes", "Python"],
    photoUrl: "https://randomuser.me/api/portraits/women/25.jpg",
  },
  {
    firstName: "Leo",
    lastName: "Fernandes",
    email: "leo@example.com",
    age: 28,
    gender: "male",
    city: "Mumbai",
    about: "Game dev hobbyist learning Unity. Want to build a multiplayer indie game.",
    skills: ["C#", "Unity", "Blender", "JavaScript"],
    photoUrl: "https://randomuser.me/api/portraits/men/26.jpg",
  },
  {
    firstName: "Meera",
    lastName: "Shah",
    email: "meera@example.com",
    age: 24,
    gender: "female",
    city: "Surat",
    about: "Content creator + developer. Building tools for creators.",
    skills: ["React", "Node.js", "YouTube API", "MongoDB"],
    photoUrl: "https://randomuser.me/api/portraits/women/27.jpg",
  },
  {
    firstName: "Nikhil",
    lastName: "Das",
    email: "nikhil@example.com",
    age: 32,
    gender: "male",
    city: "Bangalore",
    about: "Staff engineer interested in developer productivity tools.",
    skills: ["TypeScript", "Rust", "GraphQL", "Docker"],
    photoUrl: "https://randomuser.me/api/portraits/men/28.jpg",
  },
  {
    firstName: "Ojas",
    lastName: "Tiwari",
    email: "ojas@example.com",
    age: 21,
    gender: "male",
    city: "Indore",
    about: "Fresh grad learning MERN stack. Looking for internship referrals.",
    skills: ["JavaScript", "React", "Express", "MongoDB"],
    photoUrl: "https://randomuser.me/api/portraits/men/29.jpg",
  },
  {
    firstName: "Pooja",
    lastName: "Pillai",
    email: "pooja@example.com",
    age: 27,
    gender: "female",
    city: "Trivandrum",
    about: "Security engineer by day, bug bounty hunter by night.",
    skills: ["Python", "Burp Suite", "Linux", "Node.js"],
    photoUrl: "https://randomuser.me/api/portraits/women/30.jpg",
  },
];

/** [fromEmail, toEmail, status] — one record per user pair */
const connectionPairs = [
  // Demo user scenarios
  ["ananya@example.com", "demo@example.com", "interested"],
  ["kavya@example.com", "demo@example.com", "interested"],
  ["rohan@example.com", "demo@example.com", "interested"],
  ["demo@example.com", "ishita@example.com", "interested"],
  ["demo@example.com", "karan@example.com", "interested"],
  ["sneha@example.com", "demo@example.com", "accepted"],
  ["jay@example.com", "demo@example.com", "accepted"],
  ["demo@example.com", "meera@example.com", "ignore"],

  // Network among dummy users
  ["arjun@example.com", "lakshmi@example.com", "accepted"],
  ["dev.patel@example.com", "isha@example.com", "rejected"],
  ["harsh@example.com", "divya@example.com", "accepted"],
  ["manish@example.com", "kavita@example.com", "interested"],
  ["leo@example.com", "meera@example.com", "interested"],
  ["nikhil@example.com", "pooja@example.com", "accepted"],
  ["ojas@example.com", "ananya@example.com", "interested"],
  ["rohan@example.com", "kavya@example.com", "ignore"],
  ["karan@example.com", "lakshmi@example.com", "interested"],
  ["ishita@example.com", "jay@example.com", "interested"],
  ["divya@example.com", "manish@example.com", "rejected"],
  ["pooja@example.com", "nikhil@example.com", "interested"],
];

/** [fromEmail, toEmail, messageText, readByRecipient] */
const chatMessages = [
  ["demo@example.com", "sneha@example.com", "Hey Sneha! Love your fitness app idea — want to collab?", true],
  ["sneha@example.com", "demo@example.com", "Absolutely! I'm looking for a backend dev. When can we sync?", true],
  ["demo@example.com", "sneha@example.com", "This weekend works. I'll share a Figma link.", true],
  ["sneha@example.com", "demo@example.com", "Perfect, talk soon! 🚀", false],
  ["demo@example.com", "jay@example.com", "Your indie SaaS stack looks solid. Using Next.js too?", true],
  ["jay@example.com", "demo@example.com", "Yes! Happy to swap notes on Stripe integration.", true],
  ["arjun@example.com", "lakshmi@example.com", "Want to team up for the next hackathon?", true],
  ["lakshmi@example.com", "arjun@example.com", "Count me in — I have a data pipeline idea.", true],
  ["harsh@example.com", "divya@example.com", "Congrats on the match! Your Cypress setup is impressive.", true],
  ["divya@example.com", "harsh@example.com", "Thanks! Let's pair on test automation sometime.", false],
  ["nikhil@example.com", "pooja@example.com", "Fellow security-minded dev — want to review my API?", true],
  ["pooja@example.com", "nikhil@example.com", "Send it over. I do OWASP checklists for fun.", true],
];

const dedupeConnections = (pairs) => {
  const seen = new Set();
  return pairs.filter(([from, to, status]) => {
    const key = `${from}:${to}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const seedDatabase = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany({}),
      ConnectionRequest.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log("Cleared users, requests, messages, and notifications");

    const hashedUsers = [];
    for (const user of dummyUsers) {
      const plainPassword = user.password || DEFAULT_PASSWORD;
      hashedUsers.push({
        ...user,
        password: await bcrypt.hash(plainPassword, 10),
        onboardingComplete: true,
        isOnline: Math.random() > 0.6,
      });
    }

    const insertedUsers = await User.insertMany(hashedUsers);
    console.log(`✓ ${insertedUsers.length} users inserted`);

    const byEmail = Object.fromEntries(insertedUsers.map((u) => [u.email, u]));

    const uniquePairs = dedupeConnections(connectionPairs);
    const requests = uniquePairs.map(([from, to, status]) => ({
      fromUserId: byEmail[from]._id,
      toUserId: byEmail[to]._id,
      status,
    }));

    await ConnectionRequest.insertMany(requests);
    console.log(`✓ ${requests.length} connection requests inserted`);

    const messages = chatMessages.map(([from, to, text, read]) => ({
      fromUserId: byEmail[from]._id,
      toUserId: byEmail[to]._id,
      messageText: text,
      readAt: read ? new Date() : null,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    }));
    await Message.insertMany(messages);
    console.log(`✓ ${messages.length} chat messages inserted`);

    const demo = byEmail["demo@example.com"];
    const notifications = [
      {
        userId: demo._id,
        type: "request",
        title: "New connection request",
        body: `${byEmail["ananya@example.com"].firstName} sent you a connection request`,
        fromUserId: byEmail["ananya@example.com"]._id,
        link: "/app/profile",
        readAt: null,
      },
      {
        userId: demo._id,
        type: "request",
        title: "New connection request",
        body: `${byEmail["kavya@example.com"].firstName} wants to connect with you`,
        fromUserId: byEmail["kavya@example.com"]._id,
        link: "/app/profile",
        readAt: null,
      },
      {
        userId: demo._id,
        type: "match",
        title: "It's a match!",
        body: `You and ${byEmail["sneha@example.com"].firstName} are now connected`,
        fromUserId: byEmail["sneha@example.com"]._id,
        link: "/app/inbox",
        readAt: new Date(),
      },
      {
        userId: demo._id,
        type: "message",
        title: "New message",
        body: `${byEmail["sneha@example.com"].firstName}: Perfect, talk soon! 🚀`,
        fromUserId: byEmail["sneha@example.com"]._id,
        link: "/app/inbox",
        readAt: null,
      },
      {
        userId: demo._id,
        type: "match",
        title: "It's a match!",
        body: `You and ${byEmail["jay@example.com"].firstName} are now connected`,
        fromUserId: byEmail["jay@example.com"]._id,
        link: "/app/inbox",
        readAt: new Date(),
      },
    ];
    await Notification.insertMany(notifications);
    console.log(`✓ ${notifications.length} notifications inserted for demo user`);

    let md = "# DevTinder - Dummy Data\n\n";
    md += "Run: `npm run seed` from `tinder_backend`\n\n";
    md += "## Primary login\n\n";
    md += "- **Email:** demo@example.com\n";
    md += "- **Password:** DemoUser123!\n\n";
    md += "## All users (21 total)\n\n";
    md += "Default password for non-demo accounts: **DevPass123!**\n\n";
    md += "| Email | Name | City | Skills |\n";
    md += "|-------|------|------|--------|\n";

    for (const user of dummyUsers) {
      const pwd = user.password || DEFAULT_PASSWORD;
      md += `| ${user.email} | ${user.firstName} ${user.lastName} | ${user.city} | ${user.skills.join(", ")} |\n`;
    }

    md += "\n## Demo account scenarios\n\n";
    md += "| Scenario | Users |\n";
    md += "|----------|-------|\n";
    md += "| Incoming requests | Ananya, Kavya, Rohan |\n";
    md += "| Sent (pending) | Ishita, Karan |\n";
    md += "| Matches + chat | Sneha, Jay |\n";
    md += "| Passed (ignored) | Meera |\n";
    md += "| Feed profiles | ~15+ developers still discoverable |\n";

    md += "\n## Connection status types seeded\n\n";
    md += "- `interested` — pending sent/received\n";
    md += "- `accepted` — mutual matches\n";
    md += "- `rejected` — declined requests\n";
    md += "- `ignore` — passed/skipped profiles\n";

    const mdPath = path.join(__dirname, "DUMMY_CREDENTIALS.md");
    fs.writeFileSync(mdPath, md);
    console.log(`✓ Credentials written to ${mdPath}`);
    console.log("\n✓ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();
