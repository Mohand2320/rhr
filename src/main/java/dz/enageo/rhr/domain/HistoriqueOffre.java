package dz.enageo.rhr.domain;

import dz.enageo.rhr.domain.enumeration.Etat;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A HistoriqueOffre.
 */
@Entity
@Table(name = "historique_offre")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class HistoriqueOffre implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "date_historique", nullable = false)
    private LocalDate dateHistorique;

    @Enumerated(EnumType.STRING)
    @Column(name = "etat")
    private Etat etat;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public HistoriqueOffre id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateHistorique() {
        return this.dateHistorique;
    }

    public HistoriqueOffre dateHistorique(LocalDate dateHistorique) {
        this.setDateHistorique(dateHistorique);
        return this;
    }

    public void setDateHistorique(LocalDate dateHistorique) {
        this.dateHistorique = dateHistorique;
    }

    public Etat getEtat() {
        return this.etat;
    }

    public HistoriqueOffre etat(Etat etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(Etat etat) {
        this.etat = etat;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof HistoriqueOffre)) {
            return false;
        }
        return id != null && id.equals(((HistoriqueOffre) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "HistoriqueOffre{" +
            "id=" + getId() +
            ", dateHistorique='" + getDateHistorique() + "'" +
            ", etat='" + getEtat() + "'" +
            "}";
    }
}
