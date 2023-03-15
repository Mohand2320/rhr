package dz.enageo.rhr.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import dz.enageo.rhr.IntegrationTest;
import dz.enageo.rhr.domain.Prevision;
import dz.enageo.rhr.repository.PrevisionRepository;
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
 * Integration tests for the {@link PrevisionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PrevisionResourceIT {

    private static final LocalDate DEFAULT_DATE_AJOUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_AJOUT = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/previsions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PrevisionRepository previsionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPrevisionMockMvc;

    private Prevision prevision;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Prevision createEntity(EntityManager em) {
        Prevision prevision = new Prevision().dateAjout(DEFAULT_DATE_AJOUT);
        return prevision;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Prevision createUpdatedEntity(EntityManager em) {
        Prevision prevision = new Prevision().dateAjout(UPDATED_DATE_AJOUT);
        return prevision;
    }

    @BeforeEach
    public void initTest() {
        prevision = createEntity(em);
    }

    @Test
    @Transactional
    void createPrevision() throws Exception {
        int databaseSizeBeforeCreate = previsionRepository.findAll().size();
        // Create the Prevision
        restPrevisionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(prevision)))
            .andExpect(status().isCreated());

        // Validate the Prevision in the database
        List<Prevision> previsionList = previsionRepository.findAll();
        assertThat(previsionList).hasSize(databaseSizeBeforeCreate + 1);
        Prevision testPrevision = previsionList.get(previsionList.size() - 1);
        assertThat(testPrevision.getDateAjout()).isEqualTo(DEFAULT_DATE_AJOUT);
    }

    @Test
    @Transactional
    void createPrevisionWithExistingId() throws Exception {
        // Create the Prevision with an existing ID
        prevision.setId(1L);

        int databaseSizeBeforeCreate = previsionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPrevisionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(prevision)))
            .andExpect(status().isBadRequest());

        // Validate the Prevision in the database
        List<Prevision> previsionList = previsionRepository.findAll();
        assertThat(previsionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateAjoutIsRequired() throws Exception {
        int databaseSizeBeforeTest = previsionRepository.findAll().size();
        // set the field null
        prevision.setDateAjout(null);

        // Create the Prevision, which fails.

        restPrevisionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(prevision)))
            .andExpect(status().isBadRequest());

        List<Prevision> previsionList = previsionRepository.findAll();
        assertThat(previsionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPrevisions() throws Exception {
        // Initialize the database
        previsionRepository.saveAndFlush(prevision);

        // Get all the previsionList
        restPrevisionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(prevision.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateAjout").value(hasItem(DEFAULT_DATE_AJOUT.toString())));
    }

    @Test
    @Transactional
    void getPrevision() throws Exception {
        // Initialize the database
        previsionRepository.saveAndFlush(prevision);

        // Get the prevision
        restPrevisionMockMvc
            .perform(get(ENTITY_API_URL_ID, prevision.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(prevision.getId().intValue()))
            .andExpect(jsonPath("$.dateAjout").value(DEFAULT_DATE_AJOUT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPrevision() throws Exception {
        // Get the prevision
        restPrevisionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPrevision() throws Exception {
        // Initialize the database
        previsionRepository.saveAndFlush(prevision);

        int databaseSizeBeforeUpdate = previsionRepository.findAll().size();

        // Update the prevision
        Prevision updatedPrevision = previsionRepository.findById(prevision.getId()).get();
        // Disconnect from session so that the updates on updatedPrevision are not directly saved in db
        em.detach(updatedPrevision);
        updatedPrevision.dateAjout(UPDATED_DATE_AJOUT);

        restPrevisionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPrevision.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPrevision))
            )
            .andExpect(status().isOk());

        // Validate the Prevision in the database
        List<Prevision> previsionList = previsionRepository.findAll();
        assertThat(previsionList).hasSize(databaseSizeBeforeUpdate);
        Prevision testPrevision = previsionList.get(previsionList.size() - 1);
        assertThat(testPrevision.getDateAjout()).isEqualTo(UPDATED_DATE_AJOUT);
    }

    @Test
    @Transactional
    void putNonExistingPrevision() throws Exception {
        int databaseSizeBeforeUpdate = previsionRepository.findAll().size();
        prevision.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPrevisionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, prevision.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(prevision))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prevision in the database
        List<Prevision> previsionList = previsionRepository.findAll();
        assertThat(previsionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPrevision() throws Exception {
        int databaseSizeBeforeUpdate = previsionRepository.findAll().size();
        prevision.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPrevisionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(prevision))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prevision in the database
        List<Prevision> previsionList = previsionRepository.findAll();
        assertThat(previsionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPrevision() throws Exception {
        int databaseSizeBeforeUpdate = previsionRepository.findAll().size();
        prevision.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPrevisionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(prevision)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Prevision in the database
        List<Prevision> previsionList = previsionRepository.findAll();
        assertThat(previsionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePrevisionWithPatch() throws Exception {
        // Initialize the database
        previsionRepository.saveAndFlush(prevision);

        int databaseSizeBeforeUpdate = previsionRepository.findAll().size();

        // Update the prevision using partial update
        Prevision partialUpdatedPrevision = new Prevision();
        partialUpdatedPrevision.setId(prevision.getId());

        restPrevisionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPrevision.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPrevision))
            )
            .andExpect(status().isOk());

        // Validate the Prevision in the database
        List<Prevision> previsionList = previsionRepository.findAll();
        assertThat(previsionList).hasSize(databaseSizeBeforeUpdate);
        Prevision testPrevision = previsionList.get(previsionList.size() - 1);
        assertThat(testPrevision.getDateAjout()).isEqualTo(DEFAULT_DATE_AJOUT);
    }

    @Test
    @Transactional
    void fullUpdatePrevisionWithPatch() throws Exception {
        // Initialize the database
        previsionRepository.saveAndFlush(prevision);

        int databaseSizeBeforeUpdate = previsionRepository.findAll().size();

        // Update the prevision using partial update
        Prevision partialUpdatedPrevision = new Prevision();
        partialUpdatedPrevision.setId(prevision.getId());

        partialUpdatedPrevision.dateAjout(UPDATED_DATE_AJOUT);

        restPrevisionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPrevision.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPrevision))
            )
            .andExpect(status().isOk());

        // Validate the Prevision in the database
        List<Prevision> previsionList = previsionRepository.findAll();
        assertThat(previsionList).hasSize(databaseSizeBeforeUpdate);
        Prevision testPrevision = previsionList.get(previsionList.size() - 1);
        assertThat(testPrevision.getDateAjout()).isEqualTo(UPDATED_DATE_AJOUT);
    }

    @Test
    @Transactional
    void patchNonExistingPrevision() throws Exception {
        int databaseSizeBeforeUpdate = previsionRepository.findAll().size();
        prevision.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPrevisionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, prevision.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(prevision))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prevision in the database
        List<Prevision> previsionList = previsionRepository.findAll();
        assertThat(previsionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPrevision() throws Exception {
        int databaseSizeBeforeUpdate = previsionRepository.findAll().size();
        prevision.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPrevisionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(prevision))
            )
            .andExpect(status().isBadRequest());

        // Validate the Prevision in the database
        List<Prevision> previsionList = previsionRepository.findAll();
        assertThat(previsionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPrevision() throws Exception {
        int databaseSizeBeforeUpdate = previsionRepository.findAll().size();
        prevision.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPrevisionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(prevision))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Prevision in the database
        List<Prevision> previsionList = previsionRepository.findAll();
        assertThat(previsionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePrevision() throws Exception {
        // Initialize the database
        previsionRepository.saveAndFlush(prevision);

        int databaseSizeBeforeDelete = previsionRepository.findAll().size();

        // Delete the prevision
        restPrevisionMockMvc
            .perform(delete(ENTITY_API_URL_ID, prevision.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Prevision> previsionList = previsionRepository.findAll();
        assertThat(previsionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
