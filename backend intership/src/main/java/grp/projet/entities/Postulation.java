package grp.projet.entities;

import javax.persistence.*;

import java.time.LocalDateTime;

import javax.persistence.Transient;

@Entity
@Table(name = "postulations")
public class Postulation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "offer_id", nullable = false)
    private Long offerId;

    @Enumerated(EnumType.STRING)
    private PostulationStatus status = PostulationStatus.PENDING;

    @Column(name = "cover_letter")
    private String coverLetter;

    @Column(name = "applied_at")
    private LocalDateTime appliedAt;
    @Column(name = "cv_url")
    private String cvUrl;

    public Postulation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Long getOfferId() { return offerId; }
    public void setOfferId(Long offerId) { this.offerId = offerId; }

    public PostulationStatus getStatus() { return status; }
    public void setStatus(PostulationStatus status) { this.status = status; }

    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
    public String getCvUrl() { return cvUrl; }
    public void setCvUrl(String cvUrl) { this.cvUrl = cvUrl; }

    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
    }
}