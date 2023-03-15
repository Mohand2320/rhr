package dz.enageo.rhr.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Accord.
 */
@Entity
@Table(name = "accord")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Accord implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 30)
    @Column(name = "validateur", length = 30, nullable = false)
    private String validateur;

    @NotNull
    @Size(max = 30)
    @Column(name = "numero_accord", length = 30, nullable = false)
    private String numeroAccord;

    @Column(name = "date_arrivee")
    private LocalDate dateArrivee;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Accord id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getValidateur() {
        return this.validateur;
    }

    public Accord validateur(String validateur) {
        this.setValidateur(validateur);
        return this;
    }

    public void setValidateur(String validateur) {
        this.validateur = validateur;
    }

    public String getNumeroAccord() {
        return this.numeroAccord;
    }

    public Accord numeroAccord(String numeroAccord) {
        this.setNumeroAccord(numeroAccord);
        return this;
    }

    public void setNumeroAccord(String numeroAccord) {
        this.numeroAccord = numeroAccord;
    }

    public LocalDate getDateArrivee() {
        return this.dateArrivee;
    }

    public Accord dateArrivee(LocalDate dateArrivee) {
        this.setDateArrivee(dateArrivee);
        return this;
    }

    public void setDateArrivee(LocalDate dateArrivee) {
        this.dateArrivee = dateArrivee;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Accord)) {
            return false;
        }
        return id != null && id.equals(((Accord) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Accord{" +
            "id=" + getId() +
            ", validateur='" + getValidateur() + "'" +
            ", numeroAccord='" + getNumeroAccord() + "'" +
            ", dateArrivee='" + getDateArrivee() + "'" +
            "}";
    }
}
