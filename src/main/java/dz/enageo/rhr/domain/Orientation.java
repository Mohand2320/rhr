package dz.enageo.rhr.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Orientation.
 */
@Entity
@Table(name = "orientation")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Orientation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Size(max = 30)
    @Column(name = "libelle", length = 30)
    private String libelle;

    @ManyToOne
    @JsonIgnoreProperties(value = { "ville", "agence" }, allowSetters = true)
    private Agence agence;

    @ManyToMany(mappedBy = "orientations")
    @JsonIgnoreProperties(value = { "candidats", "orientations" }, allowSetters = true)
    private Set<OrientationCandidat> candidats = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Orientation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public Orientation libelle(String libelle) {
        this.setLibelle(libelle);
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public Agence getAgence() {
        return this.agence;
    }

    public void setAgence(Agence agence) {
        this.agence = agence;
    }

    public Orientation agence(Agence agence) {
        this.setAgence(agence);
        return this;
    }

    public Set<OrientationCandidat> getCandidats() {
        return this.candidats;
    }

    public void setCandidats(Set<OrientationCandidat> orientationCandidats) {
        if (this.candidats != null) {
            this.candidats.forEach(i -> i.removeOrientation(this));
        }
        if (orientationCandidats != null) {
            orientationCandidats.forEach(i -> i.addOrientation(this));
        }
        this.candidats = orientationCandidats;
    }

    public Orientation candidats(Set<OrientationCandidat> orientationCandidats) {
        this.setCandidats(orientationCandidats);
        return this;
    }

    public Orientation addCandidat(OrientationCandidat orientationCandidat) {
        this.candidats.add(orientationCandidat);
        orientationCandidat.getOrientations().add(this);
        return this;
    }

    public Orientation removeCandidat(OrientationCandidat orientationCandidat) {
        this.candidats.remove(orientationCandidat);
        orientationCandidat.getOrientations().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Orientation)) {
            return false;
        }
        return id != null && id.equals(((Orientation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Orientation{" +
            "id=" + getId() +
            ", libelle='" + getLibelle() + "'" +
            "}";
    }
}
