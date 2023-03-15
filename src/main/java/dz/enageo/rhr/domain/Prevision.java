package dz.enageo.rhr.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Prevision.
 */
@Entity
@Table(name = "prevision")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Prevision implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "date_ajout", nullable = false)
    private LocalDate dateAjout;

    @ManyToOne
    @JsonIgnoreProperties(value = { "ville", "agence" }, allowSetters = true)
    private Agence agence;

    @ManyToMany(mappedBy = "previsions")
    @JsonIgnoreProperties(value = { "previsions", "postes" }, allowSetters = true)
    private Set<PrevisionPoste> postes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Prevision id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateAjout() {
        return this.dateAjout;
    }

    public Prevision dateAjout(LocalDate dateAjout) {
        this.setDateAjout(dateAjout);
        return this;
    }

    public void setDateAjout(LocalDate dateAjout) {
        this.dateAjout = dateAjout;
    }

    public Agence getAgence() {
        return this.agence;
    }

    public void setAgence(Agence agence) {
        this.agence = agence;
    }

    public Prevision agence(Agence agence) {
        this.setAgence(agence);
        return this;
    }

    public Set<PrevisionPoste> getPostes() {
        return this.postes;
    }

    public void setPostes(Set<PrevisionPoste> previsionPostes) {
        if (this.postes != null) {
            this.postes.forEach(i -> i.removePrevision(this));
        }
        if (previsionPostes != null) {
            previsionPostes.forEach(i -> i.addPrevision(this));
        }
        this.postes = previsionPostes;
    }

    public Prevision postes(Set<PrevisionPoste> previsionPostes) {
        this.setPostes(previsionPostes);
        return this;
    }

    public Prevision addPoste(PrevisionPoste previsionPoste) {
        this.postes.add(previsionPoste);
        previsionPoste.getPrevisions().add(this);
        return this;
    }

    public Prevision removePoste(PrevisionPoste previsionPoste) {
        this.postes.remove(previsionPoste);
        previsionPoste.getPrevisions().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Prevision)) {
            return false;
        }
        return id != null && id.equals(((Prevision) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Prevision{" +
            "id=" + getId() +
            ", dateAjout='" + getDateAjout() + "'" +
            "}";
    }
}
