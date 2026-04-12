import requests
import json

BASE_URL = "http://localhost:8080/api"

# Enhanced skills data with more relevant skills for better matching
skills_data = [
    {
        "studentId": 1, 
        "skills": [
            {"skillName": "Java", "skillLevel": "ADVANCED"},
            {"skillName": "Python", "skillLevel": "ADVANCED"},
            {"skillName": "React", "skillLevel": "INTERMEDIATE"},
            {"skillName": "Spring Boot", "skillLevel": "ADVANCED"},
            {"skillName": "JavaScript", "skillLevel": "ADVANCED"},
            {"skillName": "MySQL", "skillLevel": "INTERMEDIATE"},
            {"skillName": "MongoDB", "skillLevel": "INTERMEDIATE"},
            {"skillName": "Git", "skillLevel": "ADVANCED"},
            {"skillName": "REST APIs", "skillLevel": "ADVANCED"}
        ]
    },
    {
        "studentId": 2, 
        "skills": [
            {"skillName": "React", "skillLevel": "ADVANCED"},
            {"skillName": "Angular", "skillLevel": "INTERMEDIATE"},
            {"skillName": "Node.js", "skillLevel": "ADVANCED"},
            {"skillName": "TypeScript", "skillLevel": "ADVANCED"},
            {"skillName": "Figma", "skillLevel": "INTERMEDIATE"},
            {"skillName": "JavaScript", "skillLevel": "ADVANCED"},
            {"skillName": "HTML/CSS", "skillLevel": "ADVANCED"},
            {"skillName": "Tailwind CSS", "skillLevel": "INTERMEDIATE"},
            {"skillName": "Git", "skillLevel": "ADVANCED"}
        ]
    },
    {
        "studentId": 3, 
        "skills": [
            {"skillName": "Python", "skillLevel": "ADVANCED"},
            {"skillName": "TensorFlow", "skillLevel": "ADVANCED"},
            {"skillName": "Scikit-learn", "skillLevel": "ADVANCED"},
            {"skillName": "Pandas", "skillLevel": "ADVANCED"},
            {"skillName": "SQL", "skillLevel": "ADVANCED"},
            {"skillName": "NumPy", "skillLevel": "ADVANCED"},
            {"skillName": "Machine Learning", "skillLevel": "ADVANCED"},
            {"skillName": "Data Visualization", "skillLevel": "INTERMEDIATE"}
        ]
    },
    {
        "studentId": 4, 
        "skills": [
            {"skillName": "Python", "skillLevel": "ADVANCED"},
            {"skillName": "PyTorch", "skillLevel": "ADVANCED"},
            {"skillName": "OpenCV", "skillLevel": "INTERMEDIATE"},
            {"skillName": "NLP", "skillLevel": "ADVANCED"},
            {"skillName": "Deep Learning", "skillLevel": "ADVANCED"},
            {"skillName": "TensorFlow", "skillLevel": "INTERMEDIATE"},
            {"skillName": "Computer Vision", "skillLevel": "INTERMEDIATE"}
        ]
    },
    {
        "studentId": 5, 
        "skills": [
            {"skillName": "Python", "skillLevel": "ADVANCED"},
            {"skillName": "Security", "skillLevel": "ADVANCED"},
            {"skillName": "Cryptography", "skillLevel": "INTERMEDIATE"},
            {"skillName": "Wireshark", "skillLevel": "ADVANCED"},
            {"skillName": "Metasploit", "skillLevel": "INTERMEDIATE"},
            {"skillName": "Network Security", "skillLevel": "ADVANCED"},
            {"skillName": "Linux", "skillLevel": "ADVANCED"},
            {"skillName": "Bash", "skillLevel": "INTERMEDIATE"}
        ]
    },
    {
        "studentId": 6, 
        "skills": [
            {"skillName": "React", "skillLevel": "ADVANCED"},
            {"skillName": "Node.js", "skillLevel": "ADVANCED"},
            {"skillName": "PHP", "skillLevel": "INTERMEDIATE"},
            {"skillName": "WordPress", "skillLevel": "INTERMEDIATE"},
            {"skillName": "MongoDB", "skillLevel": "ADVANCED"},
            {"skillName": "JavaScript", "skillLevel": "ADVANCED"},
            {"skillName": "HTML/CSS", "skillLevel": "ADVANCED"},
            {"skillName": "Git", "skillLevel": "ADVANCED"}
        ]
    },
    {
        "studentId": 7, 
        "skills": [
            {"skillName": "Kotlin", "skillLevel": "ADVANCED"},
            {"skillName": "Swift", "skillLevel": "ADVANCED"},
            {"skillName": "Flutter", "skillLevel": "ADVANCED"},
            {"skillName": "Firebase", "skillLevel": "INTERMEDIATE"},
            {"skillName": "Android", "skillLevel": "ADVANCED"},
            {"skillName": "iOS", "skillLevel": "INTERMEDIATE"},
            {"skillName": "REST APIs", "skillLevel": "ADVANCED"},
            {"skillName": "Git", "skillLevel": "ADVANCED"}
        ]
    },
    {
        "studentId": 8, 
        "skills": [
            {"skillName": "AWS", "skillLevel": "ADVANCED"},
            {"skillName": "Docker", "skillLevel": "ADVANCED"},
            {"skillName": "Kubernetes", "skillLevel": "ADVANCED"},
            {"skillName": "Terraform", "skillLevel": "INTERMEDIATE"},
            {"skillName": "Jenkins", "skillLevel": "ADVANCED"},
            {"skillName": "Linux", "skillLevel": "ADVANCED"},
            {"skillName": "CI/CD", "skillLevel": "ADVANCED"},
            {"skillName": "Git", "skillLevel": "ADVANCED"}
        ]
    },
    {
        "studentId": 9, 
        "skills": [
            {"skillName": "Docker", "skillLevel": "ADVANCED"},
            {"skillName": "Kubernetes", "skillLevel": "ADVANCED"},
            {"skillName": "Jenkins", "skillLevel": "ADVANCED"},
            {"skillName": "AWS", "skillLevel": "INTERMEDIATE"},
            {"skillName": "Git", "skillLevel": "ADVANCED"},
            {"skillName": "Linux", "skillLevel": "ADVANCED"},
            {"skillName": "Ansible", "skillLevel": "INTERMEDIATE"},
            {"skillName": "Prometheus", "skillLevel": "INTERMEDIATE"}
        ]
    },
    {
        "studentId": 10, 
        "skills": [
            {"skillName": "React", "skillLevel": "ADVANCED"},
            {"skillName": "Node.js", "skillLevel": "ADVANCED"},
            {"skillName": "Django", "skillLevel": "INTERMEDIATE"},
            {"skillName": "Spring Boot", "skillLevel": "ADVANCED"},
            {"skillName": "MongoDB", "skillLevel": "ADVANCED"},
            {"skillName": "PostgreSQL", "skillLevel": "INTERMEDIATE"},
            {"skillName": "JavaScript", "skillLevel": "ADVANCED"},
            {"skillName": "Python", "skillLevel": "ADVANCED"},
            {"skillName": "Git", "skillLevel": "ADVANCED"},
            {"skillName": "REST APIs", "skillLevel": "ADVANCED"}
        ]
    }
]


# Add skills to students
success_count = 0
fail_count = 0

for skill_data in skills_data:
    student_id = skill_data["studentId"]
    skills = skill_data["skills"]
    
    print(f"\n📝 Processing student {student_id}...")
    
    # Add new skills
    skills_payload = {
        "skills": skills
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/students/{student_id}/skills", 
            json=skills_payload,
            headers=headers
        )
        
        if response.status_code == 200:
            print(f"  ✅ Added {len(skills)} skills to student {student_id}")
            success_count += 1
        else:
            print(f"  ❌ Failed for student {student_id}: {response.text}")
            fail_count += 1
    except Exception as e:
        print(f"  ❌ Error for student {student_id}: {e}")
        fail_count += 1

print("\n" + "="*60)
print("📊 SKILLS IMPORT SUMMARY")
print("="*60)
print(f"✅ Successfully updated: {success_count} students")
print(f"❌ Failed: {fail_count} students")
print("="*60)

# Verify the skills were added
print("\n🔍 Verifying skills...")
for skill_data in skills_data[:3]:  # Check first 3 students
    student_id = skill_data["studentId"]
    try:
        response = requests.get(f"{BASE_URL}/students/{student_id}/skills", headers=headers)
        if response.status_code == 200:
            skills = response.json()
            print(f"\nStudent {student_id}: {len(skills)} skills found")
            for skill in skills[:5]:  # Show first 5 skills
                print(f"  - {skill['skillName']} ({skill['skillLevel']})")
    except Exception as e:
        print(f"Error verifying student {student_id}: {e}")

print("\n✅ Skills data import completed!")