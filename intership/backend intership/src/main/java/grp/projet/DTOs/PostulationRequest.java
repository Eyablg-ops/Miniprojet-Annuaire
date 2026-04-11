package grp.projet.DTOs;


public class PostulationRequest {
    private Long offerId;
    private String coverLetter;

    public PostulationRequest() {}

    public Long getOfferId() { return offerId; }
    public void setOfferId(Long offerId) { this.offerId = offerId; }

    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }
}