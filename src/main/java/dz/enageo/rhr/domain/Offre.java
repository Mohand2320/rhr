package dz.enageo.rhr.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import dz.enageo.rhr.domain.enumeration.Etat;
import dz.enageo.rhr.domain.enumeration.TypeOffre;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * The Offre entity.
 */
@Schema(description = "The Offre entity.")
@Entity
@Table(name = "offre")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Offre implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 30)
    @Column(name = "numero_offre", length = 30, nullable = false)
    private String numeroOffre;

    @NotNull
    @Column(name = "date_offre", nullable = false)
    private LocalDate dateOffre;

    @NotNull
    @Column(name = "date_depot", nullable = false)
    private LocalDate dateDepot;

    @Enumerated(EnumType.STRING)
    @Column(name = "etat_offre")
    private Etat etatOffre;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_offre")
    private TypeOffre typeOffre;

    @Column(name = "singnataire")
    private String singnataire;

    @ManyToOne
    @JsonIgnoreProperties(value = { "auteur" }, allowSetters = true)
    private Demande demande;

    @ManyToOne
    private HistoriqueOffre historiqueOffre;

    @ManyToOne
    @JsonIgnoreProperties(value = { "ville", "agence" }, allowSetters = true)
    private Agence agence;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Offre id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroOffre() {
        return this.numeroOffre;
    }

    public Offre numeroOffre(String numeroOffre) {
        this.setNumeroOffre(numeroOffre);
        return this;
    }

    public void setNumeroOffre(String numeroOffre) {
        this.numeroOffre = numeroOffre;
    }

    public LocalDate getDateOffre() {
        return this.dateOffre;
    }

    public Offre dateOffre(LocalDate dateOffre) {
        this.setDateOffre(dateOffre);
        return this;
    }

    public void setDateOffre(LocalDate dateOffre) {
        this.dateOffre = dateOffre;
    }

    public LocalDate getDateDepot() {
        return this.dateDepot;
    }

    public Offre dateDepot(LocalDate dateDepot) {
        this.setDateDepot(dateDepot);
        return this;
    }

    public void setDateDepot(LocalDate dateDepot) {
        this.dateDepot = dateDepot;
    }

    public Etat getEtatOffre() {
        return this.etatOffre;
    }

    public Offre etatOffre(Etat etatOffre) {
        this.setEtatOffre(etatOffre);
        return this;
    }

    public void setEtatOffre(Etat etatOffre) {
        this.etatOffre = etatOffre;
    }

    public TypeOffre getTypeOffre() {
        return this.typeOffre;
    }

    public Offre typeOffre(TypeOffre typeOffre) {
        this.setTypeOffre(typeOffre);
        return this;
    }

    public void setTypeOffre(TypeOffre typeOffre) {
        this.typeOffre = typeOffre;
    }

    public String getSingnataire() {
        return this.singnataire;
    }

    public Offre singnataire(String singnataire) {
        this.setSingnataire(singnataire);
        return this;
    }

    public void setSingnataire(String singnataire) {
        this.singnataire = singnataire;
    }

    public Demande getDemande() {
        return this.demande;
    }

    public void setDemande(Demande demande) {
        this.demande = demande;
    }

    public Offre demande(Demande demande) {
        this.setDemande(demande);
        return this;
    }

    public HistoriqueOffre getHistoriqueOffre() {
        return this.historiqueOffre;
    }

    public void setHistoriqueOffre(HistoriqueOffre historiqueOffre) {
        this.historiqueOffre = historiqueOffre;
    }

    public Offre historiqueOffre(HistoriqueOffre historiqueOffre) {
        this.setHistoriqueOffre(historiqueOffre);
        return this;
    }

    public Agence getAgence() {
        return this.agence;
    }

    public void setAgence(Agence agence) {
        this.agence = agence;
    }

    public Offre agence(Agence agence) {
        this.setAgence(agence);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Offre)) {
            return false;
        }
        return id != null && id.equals(((Offre) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Offre{" +
            "id=" + getId() +
            ", numeroOffre='" + getNumeroOffre() + "'" +
            ", dateOffre='" + getDateOffre() + "'" +
            ", dateDepot='" + getDateDepot() + "'" +
            ", etatOffre='" + getEtatOffre() + "'" +
            ", typeOffre='" + getTypeOffre() + "'" +
            ", singnataire='" + getSingnataire() + "'" +
            "}";
    }
}
