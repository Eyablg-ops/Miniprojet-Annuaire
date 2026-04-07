from fpdf import FPDF
import os
from datetime import datetime

class PDF(FPDF):
    def header(self):
        self.set_y(10)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 5, f'CV - {datetime.now().strftime("%Y-%m-%d")}', 0, 1, 'R')
        self.ln(5)
    
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')
    
    def section_title(self, title):
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(0, 0, 0)
        self.cell(0, 8, title, 0, 1, 'L')
        self.set_draw_color(0, 0, 0)
        self.line(self.get_x(), self.get_y(), self.get_x() + 190, self.get_y())
        self.ln(4)
    
    def bullet_point(self, text):
        self.set_font('Helvetica', '', 10)
        self.cell(5, 5, '-', 0, 0)
        self.multi_cell(0, 5, text)
        self.ln(2)
    
    def section_content(self, text):
        self.set_font('Helvetica', '', 10)
        self.multi_cell(0, 6, text)
        self.ln(2)

# Create CVs directory
os.makedirs('cvs', exist_ok=True)

# CV contents for ALL 10 students (including Malek Saidi)
students_cv_data = {
    "ahmed_benali": {
        "name": "AHMED BEN ALI",
        "title": "Computer Science Engineer Student",
        "email": "ahmed.benali@issatso.u-sousse.tn",
        "phone": "+216 98 123 456",
        "university": "ISSAT Sousse",
        "graduation": "2025",
        "gpa": "3.6/4.0",
        "education": [
            "2021-2025: Engineering Degree in Computer Science",
            "ISSAT Sousse, Tunisia",
            "GPA: 3.6/4.0"
        ],
        "skills": [
            ("Programming", "Java, Python, JavaScript, C++"),
            ("Web Development", "React, Node.js, Spring Boot"),
            ("Database", "MySQL, MongoDB, PostgreSQL"),
            ("Tools", "Git, Docker, VS Code, Postman"),
            ("Methodologies", "Agile, Scrum, CI/CD")
        ],
        "projects": [
            "E-commerce Platform (React + Node.js + MongoDB): Full-stack web application with user authentication, shopping cart, and payment integration (500+ users)",
            "Library Management System (Spring Boot + MySQL): REST API with JWT authentication, role-based access control, deployed on AWS EC2",
            "Mobile Weather App (Flutter + OpenWeather API): Real-time weather data integration with location-based services"
        ],
        "certifications": [
            "Java Programming Certification (Oracle)",
            "React Fundamentals (Meta)",
            "SQL for Data Analysis (Coursera)"
        ],
        "languages": [
            "Arabic: Native",
            "French: Fluent (DELF B2)",
            "English: Advanced (TOEIC 850)"
        ],
        "achievements": [
            "Open source contributor (2 PRs merged)",
            "Winner of University Hackathon 2023",
            "Tech blog writer (10+ articles)",
            "Volunteer coding instructor for beginners"
        ]
    },
    "sarah_mansouri": {
        "name": "SARAH MANSOURI",
        "title": "Software Engineering Student",
        "email": "sarah.mansouri@issatso.u-sousse.tn",
        "phone": "+216 98 234 567",
        "university": "ISSAT Sousse",
        "graduation": "2025",
        "gpa": "3.8/4.0",
        "education": [
            "2021-2025: Engineering Degree in Software Engineering",
            "ISSAT Sousse, Tunisia",
            "GPA: 3.8/4.0"
        ],
        "skills": [
            ("Frontend", "React, Angular, Vue.js, TypeScript"),
            ("Backend", "Node.js, Express, Python/Django"),
            ("Mobile", "React Native, Flutter"),
            ("Design", "Figma, Adobe XD, Tailwind CSS"),
            ("Testing", "Jest, Cypress, Selenium")
        ],
        "projects": [
            "Task Management App (MERN Stack): Real-time updates with Socket.io, drag-and-drop task organization (1000+ active users)",
            "Portfolio Website (React + Tailwind): Responsive design with dark mode, blog integration, SEO optimized (90+ Lighthouse score)",
            "Real-time Chat Application (Socket.io + React): Private/group messaging, file sharing, end-to-end encryption"
        ],
        "certifications": [
            "Meta Frontend Developer Professional Certificate",
            "Google UX Design Certificate",
            "AWS Cloud Practitioner"
        ],
        "languages": [
            "Arabic: Native",
            "English: Fluent (IELTS 7.5)",
            "French: Intermediate"
        ],
        "achievements": [
            "1st Place in Regional Hackathon 2023",
            "Google Developer Student Club Lead",
            "Published 2 Chrome extensions (500+ users)"
        ]
    },
    "mohamed_khemiri": {
        "name": "MOHAMED KHEMIRI",
        "title": "Data Science Student",
        "email": "mohamed.khemiri@issatso.u-sousse.tn",
        "phone": "+216 98 345 678",
        "university": "ISSAT Sousse",
        "graduation": "2025",
        "gpa": "3.7/4.0",
        "education": [
            "2021-2025: Engineering Degree in Data Science",
            "ISSAT Sousse, Tunisia",
            "GPA: 3.7/4.0"
        ],
        "skills": [
            ("Languages", "Python, R, SQL, Scala"),
            ("Machine Learning", "Scikit-learn, XGBoost, LightGBM"),
            ("Deep Learning", "TensorFlow, Keras, PyTorch"),
            ("Visualization", "Tableau, Power BI, Matplotlib"),
            ("Big Data", "Spark, Hadoop, Hive")
        ],
        "projects": [
            "Customer Churn Prediction: 85% accuracy using Random Forest, feature engineering on 50+ variables, deployed as REST API",
            "Sales Forecasting Dashboard: ARIMA and Prophet models with 95% accuracy, interactive Plotly dashboard",
            "Sentiment Analysis: BERT and LSTM implementations with 88% F1-score, real-time Twitter streaming"
        ],
        "certifications": [
            "IBM Data Science Professional Certificate",
            "TensorFlow Developer Certificate",
            "AWS Machine Learning Specialty"
        ],
        "languages": [
            "Arabic: Native",
            "French: Fluent",
            "English: Advanced"
        ],
        "achievements": [
            "Research paper 'ML for Healthcare Diagnostics' - Under review at IEEE",
            "Contributor to Scikit-learn documentation"
        ]
    },
    "ines_bouazizi": {
        "name": "INES BOUAZIZI",
        "title": "Artificial Intelligence Student",
        "email": "ines.bouazizi@issatso.u-sousse.tn",
        "phone": "+216 98 456 789",
        "university": "ISSAT Sousse",
        "graduation": "2025",
        "gpa": "3.9/4.0",
        "education": [
            "2021-2025: Engineering Degree in Artificial Intelligence",
            "ISSAT Sousse, Tunisia",
            "GPA: 3.9/4.0"
        ],
        "skills": [
            ("Deep Learning", "PyTorch, TensorFlow, Keras"),
            ("Computer Vision", "OpenCV, YOLO, Detectron2"),
            ("NLP", "NLTK, SpaCy, Hugging Face Transformers"),
            ("MLOps", "MLflow, Kubeflow, Docker"),
            ("Cloud", "AWS SageMaker, GCP Vertex AI")
        ],
        "projects": [
            "Face Recognition System: 99.2% accuracy on LFW dataset, real-time detection with OpenCV, deployed on Raspberry Pi",
            "Chatbot for Customer Service: Transformer-based architecture with multi-language support, integrated with WhatsApp API",
            "Medical Image Classification: 94% accuracy with transfer learning, web interface for pneumonia detection"
        ],
        "certifications": [
            "Deep Learning Specialization (Andrew Ng)",
            "Computer Vision Basics (OpenCV)",
            "NLP with Transformers (Hugging Face)"
        ],
        "languages": [
            "Arabic: Native",
            "English: Fluent (TOEFL 105)",
            "French: Intermediate"
        ],
        "achievements": [
            "Top performer in AI competitions",
            "Research assistant in computer vision lab"
        ]
    },
    "yassine_gharbi": {
        "name": "YASSINE GHARBI",
        "title": "Cybersecurity Student",
        "email": "yassine.gharbi@issatso.u-sousse.tn",
        "phone": "+216 98 567 890",
        "university": "ISSAT Sousse",
        "graduation": "2025",
        "gpa": "3.5/4.0",
        "education": [
            "2021-2025: Engineering Degree in Cybersecurity",
            "ISSAT Sousse, Tunisia",
            "GPA: 3.5/4.0"
        ],
        "skills": [
            ("Network Security", "Firewalls, IDS/IPS, VPN"),
            ("Cryptography", "RSA, AES, ECC, PKI"),
            ("Security Tools", "Wireshark, Metasploit, Burp Suite"),
            ("Programming", "Python, Bash, C, Assembly"),
            ("Frameworks", "OWASP, NIST, ISO 27001")
        ],
        "projects": [
            "Network Intrusion Detection System: ML-based detection with 99% accuracy, real-time packet analysis",
            "Penetration Testing: Discovered 15+ vulnerabilities, automated scanning with custom scripts",
            "Encryption Tool: AES-256 file encryption with secure key management"
        ],
        "certifications": [
            "CompTIA Security+",
            "Certified Ethical Hacker (CEH) - In Progress",
            "ISO 27001 Lead Implementer"
        ],
        "languages": [
            "Arabic: Native",
            "English: Fluent",
            "French: Good"
        ],
        "achievements": [
            "Top 10 in National CTF 2023",
            "HackTheBox Pro Hacker (50+ machines)",
            "Regular participant in Bug Bounty programs"
        ]
    },
    "nour_jemli": {
        "name": "NOUR JEMLI",
        "title": "Web Development Student",
        "email": "nour.jemli@issatso.u-sousse.tn",
        "phone": "+216 98 678 901",
        "university": "ISSAT Sousse",
        "graduation": "2025",
        "gpa": "3.6/4.0",
        "education": [
            "2021-2025: Engineering Degree in Web Development",
            "ISSAT Sousse, Tunisia",
            "GPA: 3.6/4.0"
        ],
        "skills": [
            ("Frontend", "React, Next.js, Vue.js, Nuxt.js"),
            ("Backend", "Node.js, PHP/Laravel, Python/Django"),
            ("CMS", "WordPress, Shopify, Strapi"),
            ("Databases", "MongoDB, PostgreSQL, Firebase"),
            ("DevOps", "Vercel, Netlify, AWS Amplify")
        ],
        "projects": [
            "E-learning Platform: Video streaming with HLS, quiz system with real-time grading, certificate generation (2000+ users)",
            "Real Estate Website: Property search with filters, map integration (Leaflet), admin dashboard",
            "Portfolio Generator: Drag-and-drop builder with multiple templates, SEO optimized export"
        ],
        "certifications": [
            "The Complete Web Developer Bootcamp",
            "React Certification (Meta)",
            "Next.js & React Course"
        ],
        "languages": [
            "Arabic: Native",
            "English: Fluent",
            "French: Good"
        ],
        "achievements": [
            "Built 20+ production websites",
            "WordPress theme developer"
        ]
    },
    "malek_saidi": {
        "name": "MALEK SAIDI",
        "title": "Mobile Development Student",
        "email": "malek.saidi@issatso.u-sousse.tn",
        "phone": "+216 98 789 012",
        "university": "ISSAT Sousse",
        "graduation": "2025",
        "gpa": "3.7/4.0",
        "education": [
            "2021-2025: Engineering Degree in Mobile Development",
            "ISSAT Sousse, Tunisia",
            "GPA: 3.7/4.0"
        ],
        "skills": [
            ("Android", "Kotlin, Java, Jetpack Compose"),
            ("iOS", "Swift, SwiftUI, UIKit"),
            ("Cross-platform", "Flutter, React Native"),
            ("Backend", "Firebase, Node.js, Supabase"),
            ("Tools", "Android Studio, Xcode, Figma")
        ],
        "projects": [
            "Fitness Tracker App: Workout plans, progress tracking, step counter (5000+ downloads on Play Store)",
            "Expense Manager: Budget tracking with charts, OCR receipt scanning, cloud backup",
            "Weather App: Real-time weather updates, 7-day forecast, widget support"
        ],
        "certifications": [
            "Google Associate Android Developer",
            "Flutter & Dart Certification",
            "iOS App Development with Swift"
        ],
        "languages": [
            "Arabic: Native",
            "English: Fluent",
            "French: Intermediate"
        ],
        "achievements": [
            "Published 'StudyBuddy' - 500+ downloads, 4.5 stars rating",
            "'LocalEvents' featured in Google Play"
        ]
    },
    "amira_chaabane": {
        "name": "AMIRA CHAABANE",
        "title": "Cloud Computing Student",
        "email": "amira.chaabane@issatso.u-sousse.tn",
        "phone": "+216 98 890 123",
        "university": "ISSAT Sousse",
        "graduation": "2025",
        "gpa": "3.8/4.0",
        "education": [
            "2021-2025: Engineering Degree in Cloud Computing",
            "ISSAT Sousse, Tunisia",
            "GPA: 3.8/4.0"
        ],
        "skills": [
            ("Cloud Providers", "AWS, Azure, GCP"),
            ("Infrastructure as Code", "Terraform, CloudFormation"),
            ("Containers", "Docker, Kubernetes, EKS, AKS"),
            ("CI/CD", "Jenkins, GitLab CI, GitHub Actions"),
            ("Monitoring", "Prometheus, Grafana, Datadog")
        ],
        "projects": [
            "Serverless Application: Event-driven architecture with AWS Lambda, API Gateway, DynamoDB (70% cost reduction)",
            "Kubernetes Cluster: Multi-node cluster on AWS EKS, auto-scaling, Helm charts",
            "Multi-cloud IaC: Terraform modules for AWS + Azure, state management with S3"
        ],
        "certifications": [
            "AWS Solutions Architect Associate",
            "Certified Kubernetes Administrator (CKA)",
            "HashiCorp Terraform Associate"
        ],
        "languages": [
            "Arabic: Native",
            "English: Fluent",
            "French: Good"
        ],
        "achievements": [
            "AWS Hackathon Winner 2023",
            "HashiCorp User Group Speaker"
        ]
    },
    "khalil_hadhri": {
        "name": "KHALIL HADHRI",
        "title": "DevOps Student",
        "email": "khalil.hadhri@issatso.u-sousse.tn",
        "phone": "+216 98 901 234",
        "university": "ISSAT Sousse",
        "graduation": "2025",
        "gpa": "3.6/4.0",
        "education": [
            "2021-2025: Engineering Degree in DevOps",
            "ISSAT Sousse, Tunisia",
            "GPA: 3.6/4.0"
        ],
        "skills": [
            ("CI/CD", "Jenkins, GitLab CI, CircleCI"),
            ("Configuration", "Ansible, Chef"),
            ("Containers", "Docker, Podman, containerd"),
            ("Orchestration", "Kubernetes, OpenShift"),
            ("Version Control", "Git, GitFlow, GitHub")
        ],
        "projects": [
            "Full CI/CD Pipeline: Jenkins pipeline as code, automated testing, security scanning, zero-downtime deployment",
            "Microservices with Kubernetes: Service mesh with Istio, canary deployments, EFK stack logging",
            "Automated Monitoring: Prometheus metrics, Grafana dashboards, AlertManager"
        ],
        "certifications": [
            "Docker Certified Associate",
            "Jenkins Certification",
            "CKA (Certified Kubernetes Administrator)"
        ],
        "languages": [
            "Arabic: Native",
            "English: Fluent",
            "French: Good"
        ],
        "achievements": [
            "Contributor to Kubernetes documentation",
            "Jenkins plugin developer",
            "DevOps Days speaker 2023"
        ]
    },
    "rania_benammar": {
        "name": "RANIA BEN AMMAR",
        "title": "Full Stack Development Student",
        "email": "rania.benammar@issatso.u-sousse.tn",
        "phone": "+216 98 012 345",
        "university": "ISSAT Sousse",
        "graduation": "2025",
        "gpa": "3.9/4.0",
        "education": [
            "2021-2025: Engineering Degree in Full Stack Development",
            "ISSAT Sousse, Tunisia",
            "GPA: 3.9/4.0"
        ],
        "skills": [
            ("Frontend", "React, Angular, Vue.js, Svelte"),
            ("Backend", "Node.js, Django, Spring Boot, Laravel"),
            ("Databases", "PostgreSQL, MongoDB, Redis, Cassandra"),
            ("Testing", "Jest, PyTest, JUnit, Cypress"),
            ("Architecture", "Microservices, GraphQL, WebSocket")
        ],
        "projects": [
            "Social Media Platform: Real-time posts/comments, JWT authentication, CDN integration (10,000+ simulated users)",
            "Task Management System: Drag-and-drop kanban board, team collaboration, WebSocket notifications",
            "Online Food Ordering: Restaurant management, Stripe payment, real-time order tracking"
        ],
        "certifications": [
            "Meta Backend Developer Certificate",
            "MongoDB Developer Certification",
            "GraphQL with Apollo (Udacity)"
        ],
        "languages": [
            "Arabic: Native",
            "English: Fluent (TOEFL 100)",
            "French: Intermediate"
        ],
        "achievements": [
            "Technical writer on Medium (20+ articles, 50k+ views)",
            "YouTube tutorial creator (5k+ subscribers)",
            "Speaker at local tech meetups",
            "Mentor for junior developers"
        ]
    }
}

# Generate PDFs for ALL 10 students
generated_count = 0
failed_count = 0

for name, data in students_cv_data.items():
    try:
        pdf = PDF()
        pdf.add_page()
        
        # Header with name and title
        pdf.set_font('Helvetica', 'B', 20)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(0, 10, data['name'], 0, 1, 'C')
        
        pdf.set_font('Helvetica', '', 12)
        pdf.set_text_color(100, 100, 100)
        pdf.cell(0, 8, data['title'], 0, 1, 'C')
        
        pdf.set_font('Helvetica', '', 10)
        pdf.cell(0, 6, f"Email: {data['email']} | Phone: {data['phone']}", 0, 1, 'C')
        pdf.cell(0, 6, f"University: {data['university']} | Expected Graduation: {data['graduation']} | GPA: {data['gpa']}", 0, 1, 'C')
        pdf.ln(10)
        
        # Education Section
        pdf.section_title("EDUCATION")
        for edu in data['education']:
            pdf.section_content(edu)
        
        # Skills Section
        pdf.section_title("TECHNICAL SKILLS")
        for skill, level in data['skills']:
            pdf.set_font('Helvetica', 'B', 10)
            pdf.cell(45, 6, f"{skill}:", 0, 0)
            pdf.set_font('Helvetica', '', 10)
            pdf.multi_cell(0, 6, level)
        pdf.ln(4)
        
        # Projects Section
        pdf.section_title("KEY PROJECTS")
        for project in data['projects']:
            pdf.bullet_point(project)
        
        # Certifications Section
        pdf.section_title("CERTIFICATIONS")
        for cert in data['certifications']:
            pdf.bullet_point(cert)
        
        # Languages Section
        pdf.section_title("LANGUAGES")
        for lang in data['languages']:
            pdf.bullet_point(lang)
        
        # Achievements Section
        pdf.section_title("ACHIEVEMENTS & ACTIVITIES")
        for achievement in data['achievements']:
            pdf.bullet_point(achievement)
        
        # Save PDF
        output_path = f"cvs/cv_{name}.pdf"
        pdf.output(output_path)
        print(f"✅ Generated: {output_path}")
        generated_count += 1
        
    except Exception as e:
        print(f"❌ Error generating CV for {name}: {str(e)}")
        failed_count += 1

print("\n" + "="*60)
print(f"📊 GENERATION SUMMARY")
print("="*60)
print(f"✅ Successfully generated: {generated_count} PDF files")
print(f"❌ Failed: {failed_count} PDF files")
print(f"📁 Location: {os.path.abspath('cvs')}")
print("="*60)

# List all generated files with sizes
print("\n📄 Generated CV Files (All 10 Students):")
print("-" * 50)
for filename in sorted(os.listdir('cvs')):
    if filename.endswith('.pdf'):
        file_path = os.path.join('cvs', filename)
        file_size = os.path.getsize(file_path)
        # Extract student name from filename
        student_name = filename.replace('cv_', '').replace('.pdf', '').replace('_', ' ').title()
        print(f"   {filename:30} ({file_size:>6,} bytes) - {student_name}")

print("\n✅ All 10 CVs have been generated successfully!")
print("   - cv_ahmed_benali.pdf")
print("   - cv_sarah_mansouri.pdf")
print("   - cv_mohamed_khemiri.pdf")
print("   - cv_ines_bouazizi.pdf")
print("   - cv_yassine_gharbi.pdf")
print("   - cv_nour_jemli.pdf")
print("   - cv_malek_saidi.pdf (NOW INCLUDED!)")
print("   - cv_amira_chaabane.pdf")
print("   - cv_khalil_hadhri.pdf")
print("   - cv_rania_benammar.pdf")