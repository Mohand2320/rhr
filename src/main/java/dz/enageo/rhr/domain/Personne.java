package dz.enageo.rhr.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Personne.
 */
@Entity
@Table(name = "personne")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Personne implements Serializable {

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

    @Pattern(regexp = "^(00|[+])[1-9][0-9]{8,14}$|^0[1-9][0-9]{8,9}$")
    @Column(name = "tel")
    private String tel;

    @Column(name = "numero_inscription")
    private String numeroInscription;

    @Column(name = "date_orientation")
    private LocalDate dateOrientation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Personne id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Personne nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return this.prenom;
    }

    public Personne prenom(String prenom) {
        this.setPrenom(prenom);
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public LocalDate getDateNaissance() {
        return this.dateNaissance;
    }

    public Personne dateNaissance(LocalDate dateNaissance) {
        this.setDateNaissance(dateNaissance);
        return this;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getTel() {
        return this.tel;
    }

    public Personne tel(String tel) {
        this.setTel(tel);
        return this;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getNumeroInscription() {
        return this.numeroInscription;
    }

    public Personne numeroInscription(String numeroInscription) {
        this.setNumeroInscription(numeroInscription);
        return this;
    }

    public void setNumeroInscription(String numeroInscription) {
        this.numeroInscription = numeroInscription;
    }

    public LocalDate getDateOrientation() {
        return this.dateOrientation;
    }

    public Personne dateOrientation(LocalDate dateOrientation) {
        this.setDateOrientation(dateOrientation);
        return this;
    }

    public void setDateOrientation(LocalDate dateOrientation) {
        this.dateOrientation = dateOrientation;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Personne)) {
            return false;
        }
        return id != null && id.equals(((Personne) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Personne{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            ", dateNaissance='" + getDateNaissance() + "'" +
            ", tel='" + getTel() + "'" +
            ", numeroInscription='" + getNumeroInscription() + "'" +
            ", dateOrientation='" + getDateOrientation() + "'" +
            "}";
    }
}
