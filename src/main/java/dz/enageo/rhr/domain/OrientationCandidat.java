package dz.enageo.rhr.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A OrientationCandidat.
 */
@Entity
@Table(name = "orientation_candidat")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OrientationCandidat implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "date_orientation")
    private LocalDate dateOrientation;

    @ManyToMany
    @JoinTable(
        name = "rel_orientation_candidat__candidat",
        joinColumns = @JoinColumn(name = "orientation_candidat_id"),
        inverseJoinColumns = @JoinColumn(name = "candidat_id")
    )
    @JsonIgnoreProperties(value = { "examen", "orientations" }, allowSetters = true)
    private Set<Candidat> candidats = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_orientation_candidat__orientation",
        joinColumns = @JoinColumn(name = "orientation_candidat_id"),
        inverseJoinColumns = @JoinColumn(name = "orientation_id")
    )
    @JsonIgnoreProperties(value = { "agence", "candidats" }, allowSetters = true)
    private Set<Orientation> orientations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OrientationCandidat id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateOrientation() {
        return this.dateOrientation;
    }

    public OrientationCandidat dateOrientation(LocalDate dateOrientation) {
        this.setDateOrientation(dateOrientation);
        return this;
    }

    public void setDateOrientation(LocalDate dateOrientation) {
        this.dateOrientation = dateOrientation;
    }

    public Set<Candidat> getCandidats() {
        return this.candidats;
    }

    public void setCandidats(Set<Candidat> candidats) {
        this.candidats = candidats;
    }

    public OrientationCandidat candidats(Set<Candidat> candidats) {
        this.setCandidats(candidats);
        return this;
    }

    public OrientationCandidat addCandidat(Candidat candidat) {
        this.candidats.add(candidat);
        candidat.getOrientations().add(this);
        return this;
    }

    public OrientationCandidat removeCandidat(Candidat candidat) {
        this.candidats.remove(candidat);
        candidat.getOrientations().remove(this);
        return this;
    }

    public Set<Orientation> getOrientations() {
        return this.orientations;
    }

    public void setOrientations(Set<Orientation> orientations) {
        this.orientations = orientations;
    }

    public OrientationCandidat orientations(Set<Orientation> orientations) {
        this.setOrientations(orientations);
        return this;
    }

    public OrientationCandidat addOrientation(Orientation orientation) {
        this.orientations.add(orientation);
        orientation.getCandidats().add(this);
        return this;
    }

    public OrientationCandidat removeOrientation(Orientation orientation) {
        this.orientations.remove(orientation);
        orientation.getCandidats().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OrientationCandidat)) {
            return false;
        }
        return id != null && id.equals(((OrientationCandidat) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OrientationCandidat{" +
            "id=" + getId() +
            ", dateOrientation='" + getDateOrientation() + "'" +
            "}";
    }
}
