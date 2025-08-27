import { supabase as db } from "./db";
import { companies, jobs, blogPosts } from "@shared/schema";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Create sample companies
    const { data: sampleCompanies, error: companyError } = await db
      .from("companies")
      .insert([
        {
          name: "TechCorp Solutions",
          description:
            "Leading technology company specializing in AI and machine learning solutions",
          website: "https://techcorp.example.com",
          industry: "Technology",
          size: "500-1000 employees",
          location: "San Francisco, CA",
        },
        {
          name: "DataMind Analytics",
          description:
            "Advanced data analytics and business intelligence platform",
          website: "https://datamind.example.com",
          industry: "Data Analytics",
          size: "50-200 employees",
          location: "New York, NY",
        },
        {
          name: "CloudScale Systems",
          description: "Cloud infrastructure and DevOps automation solutions",
          website: "https://cloudscale.example.com",
          industry: "Cloud Computing",
          size: "200-500 employees",
          location: "Seattle, WA",
        },
        {
          name: "InnovateTech Startups",
          description:
            "Fast-growing startup focused on innovative mobile applications",
          website: "https://innovatetech.example.com",
          industry: "Mobile Technology",
          size: "10-50 employees",
          location: "Austin, TX",
        },
        {
          name: "GlobalSoft Enterprise",
          description:
            "Enterprise software solutions for Fortune 500 companies",
          website: "https://globalsoft.example.com",
          industry: "Enterprise Software",
          size: "1000+ employees",
          location: "Boston, MA",
        },
      ])
      .select();

    if (companyError) throw companyError;
    console.log(`✅ Created ${sampleCompanies?.length} companies`);

    // Create sample jobs
    const { data: sampleJobs, error: jobsError } = await db
      .from("jobs")
      .insert([
        {
          title: "Senior Full Stack Developer",
          description:
            "Join our team to build scalable web applications using React, Node.js, and PostgreSQL. You'll work on exciting projects with cutting-edge technology and collaborate with a talented team of engineers.",
          requirements:
            "• 5+ years of experience with JavaScript/TypeScript\n• Strong expertise in React and Node.js\n• Experience with PostgreSQL or similar databases\n• Knowledge of cloud platforms (AWS, Azure, GCP)\n• Excellent problem-solving skills",
          responsibilities:
            "• Design and develop full-stack web applications\n• Collaborate with cross-functional teams\n• Write clean, maintainable code\n• Participate in code reviews and technical discussions\n• Mentor junior developers",
          companyId: sampleCompanies[0].id,
          location: "San Francisco, CA",
          type: "full-time",
          experienceLevel: "senior",
          salaryMin: 120000,
          salaryMax: 180000,
          skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
        },
        {
          title: "Data Scientist",
          description:
            "Seeking a data scientist to help drive business decisions through advanced analytics and machine learning. Work with large datasets and build predictive models.",
          requirements:
            "• Master's degree in Data Science, Statistics, or related field\n• 3+ years of experience with Python/R\n• Strong knowledge of machine learning algorithms\n• Experience with SQL and big data technologies\n• Excellent communication skills",
          responsibilities:
            "• Analyze complex datasets to extract insights\n• Build and deploy machine learning models\n• Create data visualizations and reports\n• Collaborate with business stakeholders\n• Present findings to executive team",
          companyId: sampleCompanies[1].id,
          location: "New York, NY",
          type: "full-time",
          experienceLevel: "mid",
          salaryMin: 100000,
          salaryMax: 150000,
          skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "Pandas"],
        },
        {
          title: "DevOps Engineer",
          description:
            "Looking for a DevOps engineer to help automate our infrastructure and improve deployment processes. Experience with containerization and CI/CD pipelines required.",
          requirements:
            "• 4+ years of DevOps experience\n• Strong knowledge of Docker and Kubernetes\n• Experience with AWS/Azure cloud platforms\n• Proficiency in scripting languages (Python, Bash)\n• Understanding of CI/CD best practices",
          responsibilities:
            "• Design and maintain CI/CD pipelines\n• Manage cloud infrastructure\n• Automate deployment processes\n• Monitor system performance\n• Implement security best practices",
          companyId: sampleCompanies[2].id,
          location: "Seattle, WA",
          type: "full-time",
          experienceLevel: "mid",
          salaryMin: 110000,
          salaryMax: 160000,
          skills: ["Docker", "Kubernetes", "AWS", "Python", "Jenkins"],
        },
        {
          title: "Frontend Developer",
          description:
            "Join our mobile app development team to create beautiful and intuitive user interfaces. We're looking for someone passionate about user experience and modern frontend technologies.",
          requirements:
            "• 2+ years of frontend development experience\n• Strong skills in React Native or Flutter\n• Knowledge of mobile UI/UX best practices\n• Experience with state management libraries\n• Portfolio of mobile applications",
          responsibilities:
            "• Develop mobile applications for iOS and Android\n• Implement responsive and accessible UI components\n• Optimize app performance\n• Collaborate with designers and backend developers\n• Participate in app store submission process",
          companyId: sampleCompanies[3].id,
          location: "Austin, TX",
          type: "full-time",
          experienceLevel: "entry",
          salaryMin: 80000,
          salaryMax: 120000,
          skills: [
            "React Native",
            "JavaScript",
            "Mobile Development",
            "UI/UX",
            "Redux",
          ],
        },
        {
          title: "Product Manager",
          description:
            "Seeking an experienced product manager to lead our enterprise software initiatives. You'll work closely with engineering, design, and sales teams to deliver world-class products.",
          requirements:
            "• 5+ years of product management experience\n• Experience with enterprise software products\n• Strong analytical and communication skills\n• Understanding of agile development methodologies\n• MBA or equivalent experience preferred",
          responsibilities:
            "• Define product strategy and roadmap\n• Gather and prioritize product requirements\n• Work with cross-functional teams\n• Analyze market trends and competition\n• Manage product launches and go-to-market strategy",
          companyId: sampleCompanies[4].id,
          location: "Boston, MA",
          type: "full-time",
          experienceLevel: "senior",
          salaryMin: 130000,
          salaryMax: 190000,
          skills: [
            "Product Management",
            "Strategy",
            "Analytics",
            "Agile",
            "Leadership",
          ],
        },
        {
          title: "UX/UI Designer",
          description:
            "Creative UX/UI designer needed to help shape the future of our products. You'll design user-centered experiences that delight our customers and drive business results.",
          requirements:
            "• 3+ years of UX/UI design experience\n• Proficiency in Figma, Sketch, or similar tools\n• Strong portfolio demonstrating design thinking\n• Knowledge of user research methodologies\n• Understanding of frontend development constraints",
          responsibilities:
            "• Create wireframes, prototypes, and high-fidelity designs\n• Conduct user research and usability testing\n• Collaborate with product and engineering teams\n• Maintain design system and style guides\n• Present design concepts to stakeholders",
          companyId: sampleCompanies[0].id,
          location: "Remote",
          type: "remote",
          experienceLevel: "mid",
          salaryMin: 90000,
          salaryMax: 140000,
          skills: [
            "Figma",
            "User Research",
            "Prototyping",
            "Design Systems",
            "Usability Testing",
          ],
        },
      ])
      .select();

    console.log(`✅ Created ${sampleJobs?.length} jobs`);

    // Create sample blog posts
    const { data: samplePosts, error: postsError } = await db
      .from("blogPosts")
      .insert([
        {
          title: "10 Essential Tips for Landing Your Dream Tech Job",
          content:
            "Landing a job in the tech industry can be challenging, but with the right approach and preparation, you can significantly increase your chances of success. Here are ten essential tips that will help you stand out from the competition and secure your dream position.\n\n1. **Build a Strong Portfolio**: Your portfolio is your calling card in the tech industry. Make sure it showcases your best work and demonstrates your technical skills effectively.\n\n2. **Stay Current with Technology**: The tech industry moves fast. Keep up with the latest trends, frameworks, and tools in your field.\n\n3. **Network Actively**: Attend tech meetups, conferences, and online communities. Building relationships in the industry can open doors to opportunities.\n\n4. **Practice Coding Challenges**: Many tech companies use coding interviews. Practice on platforms like LeetCode, HackerRank, or CodeSignal.\n\n5. **Understand the Company**: Research the company thoroughly before applying. Understand their products, culture, and values.\n\n6. **Optimize Your Resume**: Tailor your resume for each application. Highlight relevant experience and use keywords from the job description.\n\n7. **Prepare for Behavioral Interviews**: Use the STAR method (Situation, Task, Action, Result) to structure your answers to behavioral questions.\n\n8. **Show Your Passion**: Demonstrate genuine enthusiasm for technology and the specific role you're applying for.\n\n9. **Ask Good Questions**: Prepare thoughtful questions about the role, team, and company. This shows your genuine interest.\n\n10. **Follow Up Professionally**: Send a thank-you email after interviews and follow up appropriately on your application status.",
          excerpt:
            "Landing a job in the tech industry requires strategic preparation and the right approach. Here are ten essential tips to help you stand out and secure your dream tech position.",
          slug: "10-essential-tips-landing-dream-tech-job",
          category: "Career Tips",
          author: "Sarah Johnson",
          tags: [
            "Career Advice",
            "Tech Jobs",
            "Interview Tips",
            "Professional Development",
          ],
        },
        {
          title: "How to Write a Resume That Gets You Interviews",
          content:
            "Your resume is often the first impression you make on potential employers. In today's competitive job market, it's crucial to create a resume that not only showcases your qualifications but also passes through applicant tracking systems (ATS) and captures the attention of hiring managers.\n\n**Start with a Strong Summary**: Begin your resume with a compelling professional summary that highlights your key qualifications and career objectives. This section should be 2-3 sentences that immediately tell the employer why you're the right fit for the role.\n\n**Use Keywords Strategically**: Many companies use ATS to filter resumes before they reach human eyes. Study the job description and incorporate relevant keywords throughout your resume, particularly in your skills and experience sections.\n\n**Quantify Your Achievements**: Instead of just listing job duties, focus on your accomplishments and quantify them whenever possible. For example, 'Increased sales by 25%' is much more impactful than 'Responsible for sales activities.'\n\n**Keep It Concise and Relevant**: Most hiring managers spend only 6-10 seconds initially scanning a resume. Keep your resume to 1-2 pages and include only relevant information that supports your candidacy for the specific role.\n\n**Use a Clean, Professional Format**: Choose a clean, easy-to-read format with consistent fonts and spacing. Avoid overly creative designs unless you're in a creative field where such presentation is expected.\n\n**Proofread Meticulously**: Spelling and grammar errors can immediately disqualify you from consideration. Proofread your resume multiple times and consider having someone else review it as well.",
          excerpt:
            "Learn how to create a compelling resume that passes through applicant tracking systems and captures the attention of hiring managers in today's competitive job market.",
          slug: "how-to-write-resume-gets-interviews",
          category: "Resume Tips",
          author: "Michael Chen",
          tags: [
            "Resume Writing",
            "Job Search",
            "Career Advice",
            "ATS Optimization",
          ],
        },
        {
          title: "Remote Work: Best Practices for Productivity and Success",
          content:
            "Remote work has become increasingly common, and mastering the art of working from home is essential for career success. Whether you're new to remote work or looking to improve your current setup, these best practices will help you maintain productivity and achieve professional success.\n\n**Create a Dedicated Workspace**: Establish a specific area in your home that's solely for work. This helps create boundaries between your personal and professional life and signals to your brain when it's time to focus.\n\n**Establish a Routine**: Maintain regular working hours and stick to them. Having a consistent routine helps you stay disciplined and makes it easier for colleagues to know when you're available.\n\n**Invest in Good Technology**: Ensure you have a reliable internet connection, quality headphones for video calls, and ergonomic furniture. These investments pay dividends in productivity and health.\n\n**Communicate Proactively**: In remote work, overcommunication is better than undercommunication. Keep your team updated on your progress, challenges, and availability.\n\n**Take Regular Breaks**: It's easy to work longer hours when working from home. Schedule regular breaks and step away from your workspace to maintain your mental health and productivity.\n\n**Stay Connected with Your Team**: Make an effort to build relationships with your colleagues through virtual coffee chats, team meetings, and collaborative projects. Strong relationships are crucial for career advancement.\n\n**Set Boundaries**: Clearly communicate your working hours to family members and establish rules about interruptions during work time.\n\n**Focus on Results**: In remote work, output matters more than input. Focus on delivering quality work and meeting deadlines rather than just putting in hours.",
          excerpt:
            "Master the art of remote work with these essential best practices for maintaining productivity, building relationships, and achieving professional success while working from home.",
          slug: "remote-work-best-practices-productivity-success",
          category: "Remote Work",
          author: "Emily Rodriguez",
          tags: [
            "Remote Work",
            "Productivity",
            "Work-Life Balance",
            "Professional Development",
          ],
        },
        {
          title: "Networking Strategies That Actually Work",
          content:
            "Networking is one of the most powerful tools for career advancement, yet many professionals struggle with how to do it effectively. Building meaningful professional relationships doesn't have to feel forced or uncomfortable. Here are proven strategies that will help you build a strong professional network.\n\n**Focus on Building Relationships, Not Collecting Contacts**: Quality trumps quantity when it comes to networking. Focus on building genuine relationships with people rather than trying to meet as many people as possible.\n\n**Give Before You Receive**: The most effective networkers are those who help others first. Look for ways to provide value to your connections before asking for anything in return.\n\n**Be Authentic**: People can sense when you're being genuine versus when you're just trying to use them for professional gain. Be yourself and show genuine interest in others.\n\n**Follow Up Consistently**: The fortune is in the follow-up. After meeting someone new, send a personalized message within 24-48 hours. Reference something specific from your conversation to help them remember you.\n\n**Use Multiple Channels**: Don't limit yourself to in-person events. Leverage LinkedIn, Twitter, industry forums, and virtual events to expand your network.\n\n**Attend Industry Events Regularly**: Make it a habit to attend at least one networking event per month. This could be conferences, meetups, workshops, or online webinars.\n\n**Practice Your Elevator Pitch**: Prepare a concise, compelling introduction that clearly communicates who you are and what you do. Practice it until it feels natural.\n\n**Listen More Than You Talk**: Ask thoughtful questions and show genuine interest in others' work and challenges. People appreciate good listeners.\n\n**Stay Organized**: Keep track of your connections and interactions. Use a CRM tool or simple spreadsheet to remember important details about your contacts.",
          excerpt:
            "Learn proven networking strategies that focus on building genuine relationships and providing value to others, helping you advance your career through meaningful professional connections.",
          slug: "networking-strategies-that-actually-work",
          category: "Networking",
          author: "David Kim",
          tags: [
            "Networking",
            "Professional Relationships",
            "Career Growth",
            "Communication Skills",
          ],
        },
        {
          title: "Mastering the Art of Salary Negotiation",
          content:
            "Salary negotiation is a crucial skill that can significantly impact your lifetime earnings, yet many professionals feel uncomfortable discussing compensation. With the right preparation and approach, you can negotiate confidently and achieve fair compensation for your skills and experience.\n\n**Do Your Research**: Before entering any negotiation, research salary ranges for your position in your geographic area and industry. Use resources like Glassdoor, PayScale, and salary surveys from professional associations.\n\n**Know Your Value**: Create a comprehensive list of your accomplishments, skills, and the value you bring to the organization. Quantify your contributions wherever possible.\n\n**Consider the Total Package**: Salary is just one component of compensation. Consider benefits, vacation time, flexible work arrangements, professional development opportunities, and other perks.\n\n**Time It Right**: The best time to negotiate is after you've received a job offer but before you've accepted it. For current employees, performance reviews or after completing a major project are good opportunities.\n\n**Practice Your Pitch**: Rehearse your negotiation conversation beforehand. Practice explaining why you deserve the compensation you're requesting, backed by specific examples of your value.\n\n**Be Professional and Positive**: Approach the negotiation as a collaborative discussion rather than a confrontation. Express enthusiasm for the role while discussing compensation.\n\n**Don't Accept the First Offer**: It's generally acceptable to negotiate, even if the initial offer seems fair. Employers often expect some back-and-forth.\n\n**Get Everything in Writing**: Once you've reached an agreement, make sure all terms are documented in your offer letter or employment contract.\n\n**Be Prepared to Walk Away**: Know your minimum acceptable offer before entering negotiations. Sometimes the best negotiation tactic is being willing to decline an offer that doesn't meet your needs.",
          excerpt:
            "Learn how to negotiate salary confidently and effectively. Discover research strategies, timing tips, and conversation techniques that help you achieve fair compensation.",
          slug: "mastering-art-salary-negotiation",
          category: "Interview Tips",
          author: "Lisa Thompson",
          tags: [
            "Salary Negotiation",
            "Career Advancement",
            "Professional Development",
            "Interview Skills",
          ],
        },
      ])
      .select();

    console.log(`✅ Created ${samplePosts?.length} blog posts`);
    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
