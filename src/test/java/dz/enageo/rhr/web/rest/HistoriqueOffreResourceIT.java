package dz.enageo.rhr.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import dz.enageo.rhr.IntegrationTest;
import dz.enageo.rhr.domain.HistoriqueOffre;
import dz.enageo.rhr.domain.enumeration.Etat;
import dz.enageo.rhr.repository.HistoriqueOffreRepository;
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
 * Integration tests for the {@link HistoriqueOffreResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class HistoriqueOffreResourceIT {

    private static final LocalDate DEFAULT_DATE_HISTORIQUE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_HISTORIQUE = LocalDate.now(ZoneId.systemDefault());

    private static final Etat DEFAULT_ETAT = Etat.ETAT1;
    private static final Etat UPDATED_ETAT = Etat.ETAT2;

    private static final String ENTITY_API_URL = "/api/historique-offres";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HistoriqueOffreRepository historiqueOffreRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHistoriqueOffreMockMvc;

    private HistoriqueOffre historiqueOffre;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HistoriqueOffre createEntity(EntityManager em) {
        HistoriqueOffre historiqueOffre = new HistoriqueOffre().dateHistorique(DEFAULT_DATE_HISTORIQUE).etat(DEFAULT_ETAT);
        return historiqueOffre;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HistoriqueOffre createUpdatedEntity(EntityManager em) {
        HistoriqueOffre historiqueOffre = new HistoriqueOffre().dateHistorique(UPDATED_DATE_HISTORIQUE).etat(UPDATED_ETAT);
        return historiqueOffre;
    }

    @BeforeEach
    public void initTest() {
        historiqueOffre = createEntity(em);
    }

    @Test
    @Transactional
    void createHistoriqueOffre() throws Exception {
        int databaseSizeBeforeCreate = historiqueOffreRepository.findAll().size();
        // Create the HistoriqueOffre
        restHistoriqueOffreMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(historiqueOffre))
            )
            .andExpect(status().isCreated());

        // Validate the HistoriqueOffre in the database
        List<HistoriqueOffre> historiqueOffreList = historiqueOffreRepository.findAll();
        assertThat(historiqueOffreList).hasSize(databaseSizeBeforeCreate + 1);
        HistoriqueOffre testHistoriqueOffre = historiqueOffreList.get(historiqueOffreList.size() - 1);
        assertThat(testHistoriqueOffre.getDateHistorique()).isEqualTo(DEFAULT_DATE_HISTORIQUE);
        assertThat(testHistoriqueOffre.getEtat()).isEqualTo(DEFAULT_ETAT);
    }

    @Test
    @Transactional
    void createHistoriqueOffreWithExistingId() throws Exception {
        // Create the HistoriqueOffre with an existing ID
        historiqueOffre.setId(1L);

        int databaseSizeBeforeCreate = historiqueOffreRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHistoriqueOffreMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(historiqueOffre))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistoriqueOffre in the database
        List<HistoriqueOffre> historiqueOffreList = historiqueOffreRepository.findAll();
        assertThat(historiqueOffreList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateHistoriqueIsRequired() throws Exception {
        int databaseSizeBeforeTest = historiqueOffreRepository.findAll().size();
        // set the field null
        historiqueOffre.setDateHistorique(null);

        // Create the HistoriqueOffre, which fails.

        restHistoriqueOffreMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(historiqueOffre))
            )
            .andExpect(status().isBadRequest());

        List<HistoriqueOffre> historiqueOffreList = historiqueOffreRepository.findAll();
        assertThat(historiqueOffreList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllHistoriqueOffres() throws Exception {
        // Initialize the database
        historiqueOffreRepository.saveAndFlush(historiqueOffre);

        // Get all the historiqueOffreList
        restHistoriqueOffreMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(historiqueOffre.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateHistorique").value(hasItem(DEFAULT_DATE_HISTORIQUE.toString())))
            .andExpect(jsonPath("$.[*].etat").value(hasItem(DEFAULT_ETAT.toString())));
    }

    @Test
    @Transactional
    void getHistoriqueOffre() throws Exception {
        // Initialize the database
        historiqueOffreRepository.saveAndFlush(historiqueOffre);

        // Get the historiqueOffre
        restHistoriqueOffreMockMvc
            .perform(get(ENTITY_API_URL_ID, historiqueOffre.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(historiqueOffre.getId().intValue()))
            .andExpect(jsonPath("$.dateHistorique").value(DEFAULT_DATE_HISTORIQUE.toString()))
            .andExpect(jsonPath("$.etat").value(DEFAULT_ETAT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingHistoriqueOffre() throws Exception {
        // Get the historiqueOffre
        restHistoriqueOffreMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHistoriqueOffre() throws Exception {
        // Initialize the database
        historiqueOffreRepository.saveAndFlush(historiqueOffre);

        int databaseSizeBeforeUpdate = historiqueOffreRepository.findAll().size();

        // Update the historiqueOffre
        HistoriqueOffre updatedHistoriqueOffre = historiqueOffreRepository.findById(historiqueOffre.getId()).get();
        // Disconnect from session so that the updates on updatedHistoriqueOffre are not directly saved in db
        em.detach(updatedHistoriqueOffre);
        updatedHistoriqueOffre.dateHistorique(UPDATED_DATE_HISTORIQUE).etat(UPDATED_ETAT);

        restHistoriqueOffreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHistoriqueOffre.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHistoriqueOffre))
            )
            .andExpect(status().isOk());

        // Validate the HistoriqueOffre in the database
        List<HistoriqueOffre> historiqueOffreList = historiqueOffreRepository.findAll();
        assertThat(historiqueOffreList).hasSize(databaseSizeBeforeUpdate);
        HistoriqueOffre testHistoriqueOffre = historiqueOffreList.get(historiqueOffreList.size() - 1);
        assertThat(testHistoriqueOffre.getDateHistorique()).isEqualTo(UPDATED_DATE_HISTORIQUE);
        assertThat(testHistoriqueOffre.getEtat()).isEqualTo(UPDATED_ETAT);
    }

    @Test
    @Transactional
    void putNonExistingHistoriqueOffre() throws Exception {
        int databaseSizeBeforeUpdate = historiqueOffreRepository.findAll().size();
        historiqueOffre.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHistoriqueOffreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, historiqueOffre.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(historiqueOffre))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistoriqueOffre in the database
        List<HistoriqueOffre> historiqueOffreList = historiqueOffreRepository.findAll();
        assertThat(historiqueOffreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHistoriqueOffre() throws Exception {
        int databaseSizeBeforeUpdate = historiqueOffreRepository.findAll().size();
        historiqueOffre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistoriqueOffreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(historiqueOffre))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistoriqueOffre in the database
        List<HistoriqueOffre> historiqueOffreList = historiqueOffreRepository.findAll();
        assertThat(historiqueOffreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHistoriqueOffre() throws Exception {
        int databaseSizeBeforeUpdate = historiqueOffreRepository.findAll().size();
        historiqueOffre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistoriqueOffreMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(historiqueOffre))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the HistoriqueOffre in the database
        List<HistoriqueOffre> historiqueOffreList = historiqueOffreRepository.findAll();
        assertThat(historiqueOffreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHistoriqueOffreWithPatch() throws Exception {
        // Initialize the database
        historiqueOffreRepository.saveAndFlush(historiqueOffre);

        int databaseSizeBeforeUpdate = historiqueOffreRepository.findAll().size();

        // Update the historiqueOffre using partial update
        HistoriqueOffre partialUpdatedHistoriqueOffre = new HistoriqueOffre();
        partialUpdatedHistoriqueOffre.setId(historiqueOffre.getId());

        partialUpdatedHistoriqueOffre.dateHistorique(UPDATED_DATE_HISTORIQUE);

        restHistoriqueOffreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHistoriqueOffre.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHistoriqueOffre))
            )
            .andExpect(status().isOk());

        // Validate the HistoriqueOffre in the database
        List<HistoriqueOffre> historiqueOffreList = historiqueOffreRepository.findAll();
        assertThat(historiqueOffreList).hasSize(databaseSizeBeforeUpdate);
        HistoriqueOffre testHistoriqueOffre = historiqueOffreList.get(historiqueOffreList.size() - 1);
        assertThat(testHistoriqueOffre.getDateHistorique()).isEqualTo(UPDATED_DATE_HISTORIQUE);
        assertThat(testHistoriqueOffre.getEtat()).isEqualTo(DEFAULT_ETAT);
    }

    @Test
    @Transactional
    void fullUpdateHistoriqueOffreWithPatch() throws Exception {
        // Initialize the database
        historiqueOffreRepository.saveAndFlush(historiqueOffre);

        int databaseSizeBeforeUpdate = historiqueOffreRepository.findAll().size();

        // Update the historiqueOffre using partial update
        HistoriqueOffre partialUpdatedHistoriqueOffre = new HistoriqueOffre();
        partialUpdatedHistoriqueOffre.setId(historiqueOffre.getId());

        partialUpdatedHistoriqueOffre.dateHistorique(UPDATED_DATE_HISTORIQUE).etat(UPDATED_ETAT);

        restHistoriqueOffreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHistoriqueOffre.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHistoriqueOffre))
            )
            .andExpect(status().isOk());

        // Validate the HistoriqueOffre in the database
        List<HistoriqueOffre> historiqueOffreList = historiqueOffreRepository.findAll();
        assertThat(historiqueOffreList).hasSize(databaseSizeBeforeUpdate);
        HistoriqueOffre testHistoriqueOffre = historiqueOffreList.get(historiqueOffreList.size() - 1);
        assertThat(testHistoriqueOffre.getDateHistorique()).isEqualTo(UPDATED_DATE_HISTORIQUE);
        assertThat(testHistoriqueOffre.getEtat()).isEqualTo(UPDATED_ETAT);
    }

    @Test
    @Transactional
    void patchNonExistingHistoriqueOffre() throws Exception {
        int databaseSizeBeforeUpdate = historiqueOffreRepository.findAll().size();
        historiqueOffre.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHistoriqueOffreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, historiqueOffre.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(historiqueOffre))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistoriqueOffre in the database
        List<HistoriqueOffre> historiqueOffreList = historiqueOffreRepository.findAll();
        assertThat(historiqueOffreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHistoriqueOffre() throws Exception {
        int databaseSizeBeforeUpdate = historiqueOffreRepository.findAll().size();
        historiqueOffre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistoriqueOffreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(historiqueOffre))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistoriqueOffre in the database
        List<HistoriqueOffre> historiqueOffreList = historiqueOffreRepository.findAll();
        assertThat(historiqueOffreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHistoriqueOffre() throws Exception {
        int databaseSizeBeforeUpdate = historiqueOffreRepository.findAll().size();
        historiqueOffre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistoriqueOffreMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(historiqueOffre))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the HistoriqueOffre in the database
        List<HistoriqueOffre> historiqueOffreList = historiqueOffreRepository.findAll();
        assertThat(historiqueOffreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHistoriqueOffre() throws Exception {
        // Initialize the database
        historiqueOffreRepository.saveAndFlush(historiqueOffre);

        int databaseSizeBeforeDelete = historiqueOffreRepository.findAll().size();

        // Delete the historiqueOffre
        restHistoriqueOffreMockMvc
            .perform(delete(ENTITY_API_URL_ID, historiqueOffre.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<HistoriqueOffre> historiqueOffreList = historiqueOffreRepository.findAll();
        assertThat(historiqueOffreList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
