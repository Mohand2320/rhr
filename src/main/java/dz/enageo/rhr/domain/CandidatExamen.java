package dz.enageo.rhr.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import dz.enageo.rhr.domain.enumeration.Situation;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A CandidatExamen.
 */
@Entity
@Table(name = "candidat_examen")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CandidatExamen implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "present")
    private Boolean present;

    @Column(name = "admis")
    private Boolean admis;

    @Column(name = "reserve")
    private Boolean reserve;

    @Enumerated(EnumType.STRING)
    @Column(name = "situation")
    private Situation situation;

    @ManyToMany
    @JoinTable(
        name = "rel_candidat_examen__candidat",
        joinColumns = @JoinColumn(name = "candidat_examen_id"),
        inverseJoinColumns = @JoinColumn(name = "candidat_id")
    )
    @JsonIgnoreProperties(value = { "examen", "orientations" }, allowSetters = true)
    private Set<Candidat> candidats = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_candidat_examen__examen",
        joinColumns = @JoinColumn(name = "candidat_examen_id"),
        inverseJoinColumns = @JoinColumn(name = "examen_id")
    )
    @JsonIgnoreProperties(value = { "offrePoste", "candidats" }, allowSetters = true)
    private Set<Examen> examen = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CandidatExamen id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getPresent() {
        return this.present;
    }

    public CandidatExamen present(Boolean present) {
        this.setPresent(present);
        return this;
    }

    public void setPresent(Boolean present) {
        this.present = present;
    }

    public Boolean getAdmis() {
        return this.admis;
    }

    public CandidatExamen admis(Boolean admis) {
        this.setAdmis(admis);
        return this;
    }

    public void setAdmis(Boolean admis) {
        this.admis = admis;
    }

    public Boolean getReserve() {
        return this.reserve;
    }

    public CandidatExamen reserve(Boolean reserve) {
        this.setReserve(reserve);
        return this;
    }

    public void setReserve(Boolean reserve) {
        this.reserve = reserve;
    }

    public Situation getSituation() {
        return this.situation;
    }

    public CandidatExamen situation(Situation situation) {
        this.setSituation(situation);
        return this;
    }

    public void setSituation(Situation situation) {
        this.situation = situation;
    }

    public Set<Candidat> getCandidats() {
        return this.candidats;
    }

    public void setCandidats(Set<Candidat> candidats) {
        this.candidats = candidats;
    }

    public CandidatExamen candidats(Set<Candidat> candidats) {
        this.setCandidats(candidats);
        return this;
    }

    public CandidatExamen addCandidat(Candidat candidat) {
        this.candidats.add(candidat);
        candidat.getExamen().add(this);
        return this;
    }

    public CandidatExamen removeCandidat(Candidat candidat) {
        this.candidats.remove(candidat);
        candidat.getExamen().remove(this);
        return this;
    }

    public Set<Examen> getExamen() {
        return this.examen;
    }

    public void setExamen(Set<Examen> examen) {
        this.examen = examen;
    }

    public CandidatExamen examen(Set<Examen> examen) {
        this.setExamen(examen);
        return this;
    }

    public CandidatExamen addExamen(Examen examen) {
        this.examen.add(examen);
        examen.getCandidats().add(this);
        return this;
    }

    public CandidatExamen removeExamen(Examen examen) {
        this.examen.remove(examen);
        examen.getCandidats().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CandidatExamen)) {
            return false;
        }
        return id != null && id.equals(((CandidatExamen) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CandidatExamen{" +
            "id=" + getId() +
            ", present='" + getPresent() + "'" +
            ", admis='" + getAdmis() + "'" +
            ", reserve='" + getReserve() + "'" +
            ", situation='" + getSituation() + "'" +
            "}";
    }
}
