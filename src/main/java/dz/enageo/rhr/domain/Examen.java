package dz.enageo.rhr.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import dz.enageo.rhr.domain.enumeration.Etat;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Examen.
 */
@Entity
@Table(name = "examen")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Examen implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "date_prevue", nullable = false)
    private LocalDate datePrevue;

    @NotNull
    @Column(name = "date_examen", nullable = false)
    private LocalDate dateExamen;

    @Enumerated(EnumType.STRING)
    @Column(name = "etat")
    private Etat etat;

    @Column(name = "lieu_examen")
    private String lieuExamen;

    @Column(name = "mini_dossier")
    private String miniDossier;

    @ManyToOne
    @JsonIgnoreProperties(value = { "orientation" }, allowSetters = true)
    private OffrePoste offrePoste;

    @ManyToMany(mappedBy = "examen")
    @JsonIgnoreProperties(value = { "candidats", "examen" }, allowSetters = true)
    private Set<CandidatExamen> candidats = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Examen id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDatePrevue() {
        return this.datePrevue;
    }

    public Examen datePrevue(LocalDate datePrevue) {
        this.setDatePrevue(datePrevue);
        return this;
    }

    public void setDatePrevue(LocalDate datePrevue) {
        this.datePrevue = datePrevue;
    }

    public LocalDate getDateExamen() {
        return this.dateExamen;
    }

    public Examen dateExamen(LocalDate dateExamen) {
        this.setDateExamen(dateExamen);
        return this;
    }

    public void setDateExamen(LocalDate dateExamen) {
        this.dateExamen = dateExamen;
    }

    public Etat getEtat() {
        return this.etat;
    }

    public Examen etat(Etat etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(Etat etat) {
        this.etat = etat;
    }

    public String getLieuExamen() {
        return this.lieuExamen;
    }

    public Examen lieuExamen(String lieuExamen) {
        this.setLieuExamen(lieuExamen);
        return this;
    }

    public void setLieuExamen(String lieuExamen) {
        this.lieuExamen = lieuExamen;
    }

    public String getMiniDossier() {
        return this.miniDossier;
    }

    public Examen miniDossier(String miniDossier) {
        this.setMiniDossier(miniDossier);
        return this;
    }

    public void setMiniDossier(String miniDossier) {
        this.miniDossier = miniDossier;
    }

    public OffrePoste getOffrePoste() {
        return this.offrePoste;
    }

    public void setOffrePoste(OffrePoste offrePoste) {
        this.offrePoste = offrePoste;
    }

    public Examen offrePoste(OffrePoste offrePoste) {
        this.setOffrePoste(offrePoste);
        return this;
    }

    public Set<CandidatExamen> getCandidats() {
        return this.candidats;
    }

    public void setCandidats(Set<CandidatExamen> candidatExamen) {
        if (this.candidats != null) {
            this.candidats.forEach(i -> i.removeExamen(this));
        }
        if (candidatExamen != null) {
            candidatExamen.forEach(i -> i.addExamen(this));
        }
        this.candidats = candidatExamen;
    }

    public Examen candidats(Set<CandidatExamen> candidatExamen) {
        this.setCandidats(candidatExamen);
        return this;
    }

    public Examen addCandidat(CandidatExamen candidatExamen) {
        this.candidats.add(candidatExamen);
        candidatExamen.getExamen().add(this);
        return this;
    }

    public Examen removeCandidat(CandidatExamen candidatExamen) {
        this.candidats.remove(candidatExamen);
        candidatExamen.getExamen().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Examen)) {
            return false;
        }
        return id != null && id.equals(((Examen) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Examen{" +
            "id=" + getId() +
            ", datePrevue='" + getDatePrevue() + "'" +
            ", dateExamen='" + getDateExamen() + "'" +
            ", etat='" + getEtat() + "'" +
            ", lieuExamen='" + getLieuExamen() + "'" +
            ", miniDossier='" + getMiniDossier() + "'" +
            "}";
    }
}
