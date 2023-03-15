package dz.enageo.rhr.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Candidat.
 */
@Entity
@Table(name = "candidat")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Candidat implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 30)
    @Column(name = "nom", length = 30, nullable = false)
    private String nom;

    @NotNull
    @Size(max = 30)
    @Column(name = "prenom", length = 30, nullable = false)
    private String prenom;

    @NotNull
    @Column(name = "date_naissance", nullable = false)
    private LocalDate dateNaissance;

    @NotNull
    @Pattern(regexp = "^(00|[+])[1-9][0-9]{8,14}$|^0[1-9][0-9]{8,9}$")
    @Column(name = "tel", nullable = false)
    private String tel;

    @Column(name = "numero_inscription")
    private String numeroInscription;

    @ManyToMany(mappedBy = "candidats")
    @JsonIgnoreProperties(value = { "candidats", "examen" }, allowSetters = true)
    private Set<CandidatExamen> examen = new HashSet<>();

    @ManyToMany(mappedBy = "candidats")
    @JsonIgnoreProperties(value = { "candidats", "orientations" }, allowSetters = true)
    private Set<OrientationCandidat> orientations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Candidat id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Candidat nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return this.prenom;
    }

    public Candidat prenom(String prenom) {
        this.setPrenom(prenom);
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public LocalDate getDateNaissance() {
        return this.dateNaissance;
    }

    public Candidat dateNaissance(LocalDate dateNaissance) {
        this.setDateNaissance(dateNaissance);
        return this;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getTel() {
        return this.tel;
    }

    public Candidat tel(String tel) {
        this.setTel(tel);
        return this;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getNumeroInscription() {
        return this.numeroInscription;
    }

    public Candidat numeroInscription(String numeroInscription) {
        this.setNumeroInscription(numeroInscription);
        return this;
    }

    public void setNumeroInscription(String numeroInscription) {
        this.numeroInscription = numeroInscription;
    }

    public Set<CandidatExamen> getExamen() {
        return this.examen;
    }

    public void setExamen(Set<CandidatExamen> candidatExamen) {
        if (this.examen != null) {
            this.examen.forEach(i -> i.removeCandidat(this));
        }
        if (candidatExamen != null) {
            candidatExamen.forEach(i -> i.addCandidat(this));
        }
        this.examen = candidatExamen;
    }

    public Candidat examen(Set<CandidatExamen> candidatExamen) {
        this.setExamen(candidatExamen);
        return this;
    }

    public Candidat addExamen(CandidatExamen candidatExamen) {
        this.examen.add(candidatExamen);
        candidatExamen.getCandidats().add(this);
        return this;
    }

    public Candidat removeExamen(CandidatExamen candidatExamen) {
        this.examen.remove(candidatExamen);
        candidatExamen.getCandidats().remove(this);
        return this;
    }

    public Set<OrientationCandidat> getOrientations() {
        return this.orientations;
    }

    public void setOrientations(Set<OrientationCandidat> orientationCandidats) {
        if (this.orientations != null) {
            this.orientations.forEach(i -> i.removeCandidat(this));
        }
        if (orientationCandidats != null) {
            orientationCandidats.forEach(i -> i.addCandidat(this));
        }
        this.orientations = orientationCandidats;
    }

    public Candidat orientations(Set<OrientationCandidat> orientationCandidats) {
        this.setOrientations(orientationCandidats);
        return this;
    }

    public Candidat addOrientation(OrientationCandidat orientationCandidat) {
        this.orientations.add(orientationCandidat);
        orientationCandidat.getCandidats().add(this);
        return this;
    }

    public Candidat removeOrientation(OrientationCandidat orientationCandidat) {
        this.orientations.remove(orientationCandidat);
        orientationCandidat.getCandidats().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Candidat)) {
            return false;
        }
        return id != null && id.equals(((Candidat) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Candidat{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            ", dateNaissance='" + getDateNaissance() + "'" +
            ", tel='" + getTel() + "'" +
            ", numeroInscription='" + getNumeroInscription() + "'" +
            "}";
    }
}
