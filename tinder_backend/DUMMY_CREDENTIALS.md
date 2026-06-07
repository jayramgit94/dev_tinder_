# DevTinder - Dummy Data

Run: `npm run seed` from `tinder_backend`

## Primary login

- **Email:** demo@example.com
- **Password:** DemoUser123!

## All users (21 total)

Default password for non-demo accounts: **DevPass123!**

| Email | Name | City | Skills |
|-------|------|------|--------|
| demo@example.com | Demo User | Mumbai | JavaScript, React, Node.js, TypeScript |
| ananya@example.com | Ananya Desai | Mumbai | React, TypeScript, Tailwind CSS, Figma |
| arjun@example.com | Arjun Mehta | Bangalore | Node.js, Go, PostgreSQL, Docker |
| kavya@example.com | Kavya Reddy | Hyderabad | Python, TensorFlow, AWS, FastAPI |
| rohan@example.com | Rohan Iyer | Pune | Kubernetes, AWS, Terraform, Linux |
| sneha@example.com | Sneha Joshi | Mumbai | React Native, JavaScript, Firebase, Redux |
| dev.patel@example.com | Dev Patel | Ahmedabad | JavaScript, React, MongoDB |
| ishita@example.com | Ishita Nair | Chennai | Vue.js, CSS, Framer Motion, JavaScript |
| karan@example.com | Karan Malhotra | Delhi | Java, Spring Boot, System Design, AWS |
| lakshmi@example.com | Lakshmi Rao | Bangalore | Python, Spark, SQL, Airflow |
| manish@example.com | Manish Verma | Jaipur | Solidity, React, Node.js, Ethereum |
| divya@example.com | Divya Krishnan | Kochi | Selenium, Cypress, JavaScript, CI/CD |
| harsh@example.com | Harsh Agarwal | Lucknow | C++, Python, Algorithms, React |
| isha@example.com | Isha Banerjee | Kolkata | React, Figma, Design Systems, TypeScript |
| jay@example.com | Jay Choudhury | Goa | Next.js, Stripe, PostgreSQL, Tailwind CSS |
| kavita@example.com | Kavita Menon | Pune | AWS, Azure, Kubernetes, Python |
| leo@example.com | Leo Fernandes | Mumbai | C#, Unity, Blender, JavaScript |
| meera@example.com | Meera Shah | Surat | React, Node.js, YouTube API, MongoDB |
| nikhil@example.com | Nikhil Das | Bangalore | TypeScript, Rust, GraphQL, Docker |
| ojas@example.com | Ojas Tiwari | Indore | JavaScript, React, Express, MongoDB |
| pooja@example.com | Pooja Pillai | Trivandrum | Python, Burp Suite, Linux, Node.js |

## Demo account scenarios

| Scenario | Users |
|----------|-------|
| Incoming requests | Ananya, Kavya, Rohan |
| Sent (pending) | Ishita, Karan |
| Matches + chat | Sneha, Jay |
| Passed (ignored) | Meera |
| Feed profiles | ~15+ developers still discoverable |

## Connection status types seeded

- `interested` — pending sent/received
- `accepted` — mutual matches
- `rejected` — declined requests
- `ignore` — passed/skipped profiles
