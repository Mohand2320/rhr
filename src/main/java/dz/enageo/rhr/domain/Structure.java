package dz.enageo.rhr.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Structure.
 */
@Entity
@Table(name = "structure")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Structure implements Serializable {

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

    @ManyToOne
    @JsonIgnoreProperties(value = { "auteur" }, allowSetters = true)
    private Demande demande;

    @ManyToOne
    @JsonIgnoreProperties(value = { "demande", "historiqueOffre", "agence" }, allowSetters = true)
    private Offre offre;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Structure id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Structure nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Demande getDemande() {
        return this.demande;
    }

    public void setDemande(Demande demande) {
        this.demande = demande;
    }

    public Structure demande(Demande demande) {
        this.setDemande(demande);
        return this;
    }

    public Offre getOffre() {
        return this.offre;
    }

    public void setOffre(Offre offre) {
        this.offre = offre;
    }

    public Structure offre(Offre offre) {
        this.setOffre(offre);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Structure)) {
            return false;
        }
        return id != null && id.equals(((Structure) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Structure{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
