package dz.enageo.rhr.domain;

import dz.enageo.rhr.domain.enumeration.Etat;
import dz.enageo.rhr.domain.enumeration.TypeDemande;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Demande.
 */
@Entity
@Table(name = "demande")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Demande implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 60)
    @Column(name = "ref", length = 60, nullable = false)
    private String ref;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_demande")
    private TypeDemande typeDemande;

    @Column(name = "date_depot")
    private LocalDate dateDepot;

    @Enumerated(EnumType.STRING)
    @Column(name = "etat")
    private Etat etat;

    @OneToOne
    @JoinColumn(unique = true)
    private Accord auteur;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Demande id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRef() {
        return this.ref;
    }

    public Demande ref(String ref) {
        this.setRef(ref);
        return this;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public TypeDemande getTypeDemande() {
        return this.typeDemande;
    }

    public Demande typeDemande(TypeDemande typeDemande) {
        this.setTypeDemande(typeDemande);
        return this;
    }

    public void setTypeDemande(TypeDemande typeDemande) {
        this.typeDemande = typeDemande;
    }

    public LocalDate getDateDepot() {
        return this.dateDepot;
    }

    public Demande dateDepot(LocalDate dateDepot) {
        this.setDateDepot(dateDepot);
        return this;
    }

    public void setDateDepot(LocalDate dateDepot) {
        this.dateDepot = dateDepot;
    }

    public Etat getEtat() {
        return this.etat;
    }

    public Demande etat(Etat etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(Etat etat) {
        this.etat = etat;
    }

    public Accord getAuteur() {
        return this.auteur;
    }

    public void setAuteur(Accord accord) {
        this.auteur = accord;
    }

    public Demande auteur(Accord accord) {
        this.setAuteur(accord);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Demande)) {
            return false;
        }
        return id != null && id.equals(((Demande) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Demande{" +
            "id=" + getId() +
            ", ref='" + getRef() + "'" +
            ", typeDemande='" + getTypeDemande() + "'" +
            ", dateDepot='" + getDateDepot() + "'" +
            ", etat='" + getEtat() + "'" +
            "}";
    }
}
