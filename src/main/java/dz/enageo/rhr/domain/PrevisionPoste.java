package dz.enageo.rhr.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A PrevisionPoste.
 */
@Entity
@Table(name = "prevision_poste")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PrevisionPoste implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "date_ajout")
    private LocalDate dateAjout;

    @ManyToMany
    @JoinTable(
        name = "rel_prevision_poste__prevision",
        joinColumns = @JoinColumn(name = "prevision_poste_id"),
        inverseJoinColumns = @JoinColumn(name = "prevision_id")
    )
    @JsonIgnoreProperties(value = { "agence", "postes" }, allowSetters = true)
    private Set<Prevision> previsions = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_prevision_poste__poste",
        joinColumns = @JoinColumn(name = "prevision_poste_id"),
        inverseJoinColumns = @JoinColumn(name = "poste_id")
    )
    @JsonIgnoreProperties(value = { "previsions" }, allowSetters = true)
    private Set<Poste> postes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PrevisionPoste id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateAjout() {
        return this.dateAjout;
    }

    public PrevisionPoste dateAjout(LocalDate dateAjout) {
        this.setDateAjout(dateAjout);
        return this;
    }

    public void setDateAjout(LocalDate dateAjout) {
        this.dateAjout = dateAjout;
    }

    public Set<Prevision> getPrevisions() {
        return this.previsions;
    }

    public void setPrevisions(Set<Prevision> previsions) {
        this.previsions = previsions;
    }

    public PrevisionPoste previsions(Set<Prevision> previsions) {
        this.setPrevisions(previsions);
        return this;
    }

    public PrevisionPoste addPrevision(Prevision prevision) {
        this.previsions.add(prevision);
        prevision.getPostes().add(this);
        return this;
    }

    public PrevisionPoste removePrevision(Prevision prevision) {
        this.previsions.remove(prevision);
        prevision.getPostes().remove(this);
        return this;
    }

    public Set<Poste> getPostes() {
        return this.postes;
    }

    public void setPostes(Set<Poste> postes) {
        this.postes = postes;
    }

    public PrevisionPoste postes(Set<Poste> postes) {
        this.setPostes(postes);
        return this;
    }

    public PrevisionPoste addPoste(Poste poste) {
        this.postes.add(poste);
        poste.getPrevisions().add(this);
        return this;
    }

    public PrevisionPoste removePoste(Poste poste) {
        this.postes.remove(poste);
        poste.getPrevisions().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PrevisionPoste)) {
            return false;
        }
        return id != null && id.equals(((PrevisionPoste) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PrevisionPoste{" +
            "id=" + getId() +
            ", dateAjout='" + getDateAjout() + "'" +
            "}";
    }
}
