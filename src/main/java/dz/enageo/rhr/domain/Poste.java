package dz.enageo.rhr.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import dz.enageo.rhr.domain.enumeration.TypePoste;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Poste.
 */
@Entity
@Table(name = "poste")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Poste implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 30)
    @Column(name = "nom_poste", length = 30, nullable = false)
    private String nomPoste;

    @Size(max = 30)
    @Column(name = "numero_poste", length = 30)
    private String numeroPoste;

    @Column(name = "diponible")
    private Boolean diponible;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_poste")
    private TypePoste typePoste;

    @ManyToMany(mappedBy = "postes")
    @JsonIgnoreProperties(value = { "previsions", "postes" }, allowSetters = true)
    private Set<PrevisionPoste> previsions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Poste id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomPoste() {
        return this.nomPoste;
    }

    public Poste nomPoste(String nomPoste) {
        this.setNomPoste(nomPoste);
        return this;
    }

    public void setNomPoste(String nomPoste) {
        this.nomPoste = nomPoste;
    }

    public String getNumeroPoste() {
        return this.numeroPoste;
    }

    public Poste numeroPoste(String numeroPoste) {
        this.setNumeroPoste(numeroPoste);
        return this;
    }

    public void setNumeroPoste(String numeroPoste) {
        this.numeroPoste = numeroPoste;
    }

    public Boolean getDiponible() {
        return this.diponible;
    }

    public Poste diponible(Boolean diponible) {
        this.setDiponible(diponible);
        return this;
    }

    public void setDiponible(Boolean diponible) {
        this.diponible = diponible;
    }

    public TypePoste getTypePoste() {
        return this.typePoste;
    }

    public Poste typePoste(TypePoste typePoste) {
        this.setTypePoste(typePoste);
        return this;
    }

    public void setTypePoste(TypePoste typePoste) {
        this.typePoste = typePoste;
    }

    public Set<PrevisionPoste> getPrevisions() {
        return this.previsions;
    }

    public void setPrevisions(Set<PrevisionPoste> previsionPostes) {
        if (this.previsions != null) {
            this.previsions.forEach(i -> i.removePoste(this));
        }
        if (previsionPostes != null) {
            previsionPostes.forEach(i -> i.addPoste(this));
        }
        this.previsions = previsionPostes;
    }

    public Poste previsions(Set<PrevisionPoste> previsionPostes) {
        this.setPrevisions(previsionPostes);
        return this;
    }

    public Poste addPrevision(PrevisionPoste previsionPoste) {
        this.previsions.add(previsionPoste);
        previsionPoste.getPostes().add(this);
        return this;
    }

    public Poste removePrevision(PrevisionPoste previsionPoste) {
        this.previsions.remove(previsionPoste);
        previsionPoste.getPostes().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Poste)) {
            return false;
        }
        return id != null && id.equals(((Poste) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Poste{" +
            "id=" + getId() +
            ", nomPoste='" + getNomPoste() + "'" +
            ", numeroPoste='" + getNumeroPoste() + "'" +
            ", diponible='" + getDiponible() + "'" +
            ", typePoste='" + getTypePoste() + "'" +
            "}";
    }
}
