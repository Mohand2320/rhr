package dz.enageo.rhr.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * OffrePoste entity.\n@author The AMOUAR MOHAND RACHID.
 */
@Schema(description = "OffrePoste entity.\n@author The AMOUAR MOHAND RACHID.")
@Entity
@Table(name = "offre_poste")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OffrePoste implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nbr", nullable = false)
    private Integer nbr;

    @Column(name = "exigence")
    private String exigence;

    @JsonIgnoreProperties(value = { "agence", "candidats" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Orientation orientation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OffrePoste id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNbr() {
        return this.nbr;
    }

    public OffrePoste nbr(Integer nbr) {
        this.setNbr(nbr);
        return this;
    }

    public void setNbr(Integer nbr) {
        this.nbr = nbr;
    }

    public String getExigence() {
        return this.exigence;
    }

    public OffrePoste exigence(String exigence) {
        this.setExigence(exigence);
        return this;
    }

    public void setExigence(String exigence) {
        this.exigence = exigence;
    }

    public Orientation getOrientation() {
        return this.orientation;
    }

    public void setOrientation(Orientation orientation) {
        this.orientation = orientation;
    }

    public OffrePoste orientation(Orientation orientation) {
        this.setOrientation(orientation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OffrePoste)) {
            return false;
        }
        return id != null && id.equals(((OffrePoste) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OffrePoste{" +
            "id=" + getId() +
            ", nbr=" + getNbr() +
            ", exigence='" + getExigence() + "'" +
            "}";
    }
}
