package dz.enageo.rhr.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import dz.enageo.rhr.IntegrationTest;
import dz.enageo.rhr.domain.Offre;
import dz.enageo.rhr.domain.enumeration.Etat;
import dz.enageo.rhr.domain.enumeration.TypeOffre;
import dz.enageo.rhr.repository.OffreRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link OffreResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OffreResourceIT {

    private static final String DEFAULT_NUMERO_OFFRE = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_OFFRE = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_OFFRE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_OFFRE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_DEPOT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_DEPOT = LocalDate.now(ZoneId.systemDefault());

    private static final Etat DEFAULT_ETAT_OFFRE = Etat.ETAT1;
    private static final Etat UPDATED_ETAT_OFFRE = Etat.ETAT2;

    private static final TypeOffre DEFAULT_TYPE_OFFRE = TypeOffre.TYPE1;
    private static final TypeOffre UPDATED_TYPE_OFFRE = TypeOffre.TYPE2;

    private static final String DEFAULT_SINGNATAIRE = "AAAAAAAAAA";
    private static final String UPDATED_SINGNATAIRE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/offres";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OffreRepository offreRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOffreMockMvc;

    private Offre offre;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Offre createEntity(EntityManager em) {
        Offre offre = new Offre()
            .numeroOffre(DEFAULT_NUMERO_OFFRE)
            .dateOffre(DEFAULT_DATE_OFFRE)
            .dateDepot(DEFAULT_DATE_DEPOT)
            .etatOffre(DEFAULT_ETAT_OFFRE)
            .typeOffre(DEFAULT_TYPE_OFFRE)
            .singnataire(DEFAULT_SINGNATAIRE);
        return offre;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Offre createUpdatedEntity(EntityManager em) {
        Offre offre = new Offre()
            .numeroOffre(UPDATED_NUMERO_OFFRE)
            .dateOffre(UPDATED_DATE_OFFRE)
            .dateDepot(UPDATED_DATE_DEPOT)
            .etatOffre(UPDATED_ETAT_OFFRE)
            .typeOffre(UPDATED_TYPE_OFFRE)
            .singnataire(UPDATED_SINGNATAIRE);
        return offre;
    }

    @BeforeEach
    public void initTest() {
        offre = createEntity(em);
    }

    @Test
    @Transactional
    void createOffre() throws Exception {
        int databaseSizeBeforeCreate = offreRepository.findAll().size();
        // Create the Offre
        restOffreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offre)))
            .andExpect(status().isCreated());

        // Validate the Offre in the database
        List<Offre> offreList = offreRepository.findAll();
        assertThat(offreList).hasSize(databaseSizeBeforeCreate + 1);
        Offre testOffre = offreList.get(offreList.size() - 1);
        assertThat(testOffre.getNumeroOffre()).isEqualTo(DEFAULT_NUMERO_OFFRE);
        assertThat(testOffre.getDateOffre()).isEqualTo(DEFAULT_DATE_OFFRE);
        assertThat(testOffre.getDateDepot()).isEqualTo(DEFAULT_DATE_DEPOT);
        assertThat(testOffre.getEtatOffre()).isEqualTo(DEFAULT_ETAT_OFFRE);
        assertThat(testOffre.getTypeOffre()).isEqualTo(DEFAULT_TYPE_OFFRE);
        assertThat(testOffre.getSingnataire()).isEqualTo(DEFAULT_SINGNATAIRE);
    }

    @Test
    @Transactional
    void createOffreWithExistingId() throws Exception {
        // Create the Offre with an existing ID
        offre.setId(1L);

        int databaseSizeBeforeCreate = offreRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOffreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offre)))
            .andExpect(status().isBadRequest());

        // Validate the Offre in the database
        List<Offre> offreList = offreRepository.findAll();
        assertThat(offreList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNumeroOffreIsRequired() throws Exception {
        int databaseSizeBeforeTest = offreRepository.findAll().size();
        // set the field null
        offre.setNumeroOffre(null);

        // Create the Offre, which fails.

        restOffreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offre)))
            .andExpect(status().isBadRequest());

        List<Offre> offreList = offreRepository.findAll();
        assertThat(offreList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateOffreIsRequired() throws Exception {
        int databaseSizeBeforeTest = offreRepository.findAll().size();
        // set the field null
        offre.setDateOffre(null);

        // Create the Offre, which fails.

        restOffreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offre)))
            .andExpect(status().isBadRequest());

        List<Offre> offreList = offreRepository.findAll();
        assertThat(offreList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateDepotIsRequired() throws Exception {
        int databaseSizeBeforeTest = offreRepository.findAll().size();
        // set the field null
        offre.setDateDepot(null);

        // Create the Offre, which fails.

        restOffreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offre)))
            .andExpect(status().isBadRequest());

        List<Offre> offreList = offreRepository.findAll();
        assertThat(offreList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOffres() throws Exception {
        // Initialize the database
        offreRepository.saveAndFlush(offre);

        // Get all the offreList
        restOffreMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(offre.getId().intValue())))
            .andExpect(jsonPath("$.[*].numeroOffre").value(hasItem(DEFAULT_NUMERO_OFFRE)))
            .andExpect(jsonPath("$.[*].dateOffre").value(hasItem(DEFAULT_DATE_OFFRE.toString())))
            .andExpect(jsonPath("$.[*].dateDepot").value(hasItem(DEFAULT_DATE_DEPOT.toString())))
            .andExpect(jsonPath("$.[*].etatOffre").value(hasItem(DEFAULT_ETAT_OFFRE.toString())))
            .andExpect(jsonPath("$.[*].typeOffre").value(hasItem(DEFAULT_TYPE_OFFRE.toString())))
            .andExpect(jsonPath("$.[*].singnataire").value(hasItem(DEFAULT_SINGNATAIRE)));
    }

    @Test
    @Transactional
    void getOffre() throws Exception {
        // Initialize the database
        offreRepository.saveAndFlush(offre);

        // Get the offre
        restOffreMockMvc
            .perform(get(ENTITY_API_URL_ID, offre.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(offre.getId().intValue()))
            .andExpect(jsonPath("$.numeroOffre").value(DEFAULT_NUMERO_OFFRE))
            .andExpect(jsonPath("$.dateOffre").value(DEFAULT_DATE_OFFRE.toString()))
            .andExpect(jsonPath("$.dateDepot").value(DEFAULT_DATE_DEPOT.toString()))
            .andExpect(jsonPath("$.etatOffre").value(DEFAULT_ETAT_OFFRE.toString()))
            .andExpect(jsonPath("$.typeOffre").value(DEFAULT_TYPE_OFFRE.toString()))
            .andExpect(jsonPath("$.singnataire").value(DEFAULT_SINGNATAIRE));
    }

    @Test
    @Transactional
    void getNonExistingOffre() throws Exception {
        // Get the offre
        restOffreMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOffre() throws Exception {
        // Initialize the database
        offreRepository.saveAndFlush(offre);

        int databaseSizeBeforeUpdate = offreRepository.findAll().size();

        // Update the offre
        Offre updatedOffre = offreRepository.findById(offre.getId()).get();
        // Disconnect from session so that the updates on updatedOffre are not directly saved in db
        em.detach(updatedOffre);
        updatedOffre
            .numeroOffre(UPDATED_NUMERO_OFFRE)
            .dateOffre(UPDATED_DATE_OFFRE)
            .dateDepot(UPDATED_DATE_DEPOT)
            .etatOffre(UPDATED_ETAT_OFFRE)
            .typeOffre(UPDATED_TYPE_OFFRE)
            .singnataire(UPDATED_SINGNATAIRE);

        restOffreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOffre.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOffre))
            )
            .andExpect(status().isOk());

        // Validate the Offre in the database
        List<Offre> offreList = offreRepository.findAll();
        assertThat(offreList).hasSize(databaseSizeBeforeUpdate);
        Offre testOffre = offreList.get(offreList.size() - 1);
        assertThat(testOffre.getNumeroOffre()).isEqualTo(UPDATED_NUMERO_OFFRE);
        assertThat(testOffre.getDateOffre()).isEqualTo(UPDATED_DATE_OFFRE);
        assertThat(testOffre.getDateDepot()).isEqualTo(UPDATED_DATE_DEPOT);
        assertThat(testOffre.getEtatOffre()).isEqualTo(UPDATED_ETAT_OFFRE);
        assertThat(testOffre.getTypeOffre()).isEqualTo(UPDATED_TYPE_OFFRE);
        assertThat(testOffre.getSingnataire()).isEqualTo(UPDATED_SINGNATAIRE);
    }

    @Test
    @Transactional
    void putNonExistingOffre() throws Exception {
        int databaseSizeBeforeUpdate = offreRepository.findAll().size();
        offre.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOffreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, offre.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(offre))
            )
            .andExpect(status().isBadRequest());

        // Validate the Offre in the database
        List<Offre> offreList = offreRepository.findAll();
        assertThat(offreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOffre() throws Exception {
        int databaseSizeBeforeUpdate = offreRepository.findAll().size();
        offre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(offre))
            )
            .andExpect(status().isBadRequest());

        // Validate the Offre in the database
        List<Offre> offreList = offreRepository.findAll();
        assertThat(offreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOffre() throws Exception {
        int databaseSizeBeforeUpdate = offreRepository.findAll().size();
        offre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offre)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Offre in the database
        List<Offre> offreList = offreRepository.findAll();
        assertThat(offreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOffreWithPatch() throws Exception {
        // Initialize the database
        offreRepository.saveAndFlush(offre);

        int databaseSizeBeforeUpdate = offreRepository.findAll().size();

        // Update the offre using partial update
        Offre partialUpdatedOffre = new Offre();
        partialUpdatedOffre.setId(offre.getId());

        partialUpdatedOffre.dateDepot(UPDATED_DATE_DEPOT).etatOffre(UPDATED_ETAT_OFFRE);

        restOffreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOffre.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOffre))
            )
            .andExpect(status().isOk());

        // Validate the Offre in the database
        List<Offre> offreList = offreRepository.findAll();
        assertThat(offreList).hasSize(databaseSizeBeforeUpdate);
        Offre testOffre = offreList.get(offreList.size() - 1);
        assertThat(testOffre.getNumeroOffre()).isEqualTo(DEFAULT_NUMERO_OFFRE);
        assertThat(testOffre.getDateOffre()).isEqualTo(DEFAULT_DATE_OFFRE);
        assertThat(testOffre.getDateDepot()).isEqualTo(UPDATED_DATE_DEPOT);
        assertThat(testOffre.getEtatOffre()).isEqualTo(UPDATED_ETAT_OFFRE);
        assertThat(testOffre.getTypeOffre()).isEqualTo(DEFAULT_TYPE_OFFRE);
        assertThat(testOffre.getSingnataire()).isEqualTo(DEFAULT_SINGNATAIRE);
    }

    @Test
    @Transactional
    void fullUpdateOffreWithPatch() throws Exception {
        // Initialize the database
        offreRepository.saveAndFlush(offre);

        int databaseSizeBeforeUpdate = offreRepository.findAll().size();

        // Update the offre using partial update
        Offre partialUpdatedOffre = new Offre();
        partialUpdatedOffre.setId(offre.getId());

        partialUpdatedOffre
            .numeroOffre(UPDATED_NUMERO_OFFRE)
            .dateOffre(UPDATED_DATE_OFFRE)
            .dateDepot(UPDATED_DATE_DEPOT)
            .etatOffre(UPDATED_ETAT_OFFRE)
            .typeOffre(UPDATED_TYPE_OFFRE)
            .singnataire(UPDATED_SINGNATAIRE);

        restOffreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOffre.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOffre))
            )
            .andExpect(status().isOk());

        // Validate the Offre in the database
        List<Offre> offreList = offreRepository.findAll();
        assertThat(offreList).hasSize(databaseSizeBeforeUpdate);
        Offre testOffre = offreList.get(offreList.size() - 1);
        assertThat(testOffre.getNumeroOffre()).isEqualTo(UPDATED_NUMERO_OFFRE);
        assertThat(testOffre.getDateOffre()).isEqualTo(UPDATED_DATE_OFFRE);
        assertThat(testOffre.getDateDepot()).isEqualTo(UPDATED_DATE_DEPOT);
        assertThat(testOffre.getEtatOffre()).isEqualTo(UPDATED_ETAT_OFFRE);
        assertThat(testOffre.getTypeOffre()).isEqualTo(UPDATED_TYPE_OFFRE);
        assertThat(testOffre.getSingnataire()).isEqualTo(UPDATED_SINGNATAIRE);
    }

    @Test
    @Transactional
    void patchNonExistingOffre() throws Exception {
        int databaseSizeBeforeUpdate = offreRepository.findAll().size();
        offre.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOffreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, offre.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(offre))
            )
            .andExpect(status().isBadRequest());

        // Validate the Offre in the database
        List<Offre> offreList = offreRepository.findAll();
        assertThat(offreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOffre() throws Exception {
        int databaseSizeBeforeUpdate = offreRepository.findAll().size();
        offre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(offre))
            )
            .andExpect(status().isBadRequest());

        // Validate the Offre in the database
        List<Offre> offreList = offreRepository.findAll();
        assertThat(offreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOffre() throws Exception {
        int databaseSizeBeforeUpdate = offreRepository.findAll().size();
        offre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffreMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(offre)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Offre in the database
        List<Offre> offreList = offreRepository.findAll();
        assertThat(offreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOffre() throws Exception {
        // Initialize the database
        offreRepository.saveAndFlush(offre);

        int databaseSizeBeforeDelete = offreRepository.findAll().size();

        // Delete the offre
        restOffreMockMvc
            .perform(delete(ENTITY_API_URL_ID, offre.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Offre> offreList = offreRepository.findAll();
        assertThat(offreList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
