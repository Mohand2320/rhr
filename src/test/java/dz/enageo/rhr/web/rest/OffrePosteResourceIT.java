package dz.enageo.rhr.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import dz.enageo.rhr.IntegrationTest;
import dz.enageo.rhr.domain.OffrePoste;
import dz.enageo.rhr.repository.OffrePosteRepository;
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
 * Integration tests for the {@link OffrePosteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OffrePosteResourceIT {

    private static final Integer DEFAULT_NBR = 1;
    private static final Integer UPDATED_NBR = 2;

    private static final String DEFAULT_EXIGENCE = "AAAAAAAAAA";
    private static final String UPDATED_EXIGENCE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/offre-postes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OffrePosteRepository offrePosteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOffrePosteMockMvc;

    private OffrePoste offrePoste;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OffrePoste createEntity(EntityManager em) {
        OffrePoste offrePoste = new OffrePoste().nbr(DEFAULT_NBR).exigence(DEFAULT_EXIGENCE);
        return offrePoste;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OffrePoste createUpdatedEntity(EntityManager em) {
        OffrePoste offrePoste = new OffrePoste().nbr(UPDATED_NBR).exigence(UPDATED_EXIGENCE);
        return offrePoste;
    }

    @BeforeEach
    public void initTest() {
        offrePoste = createEntity(em);
    }

    @Test
    @Transactional
    void createOffrePoste() throws Exception {
        int databaseSizeBeforeCreate = offrePosteRepository.findAll().size();
        // Create the OffrePoste
        restOffrePosteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offrePoste)))
            .andExpect(status().isCreated());

        // Validate the OffrePoste in the database
        List<OffrePoste> offrePosteList = offrePosteRepository.findAll();
        assertThat(offrePosteList).hasSize(databaseSizeBeforeCreate + 1);
        OffrePoste testOffrePoste = offrePosteList.get(offrePosteList.size() - 1);
        assertThat(testOffrePoste.getNbr()).isEqualTo(DEFAULT_NBR);
        assertThat(testOffrePoste.getExigence()).isEqualTo(DEFAULT_EXIGENCE);
    }

    @Test
    @Transactional
    void createOffrePosteWithExistingId() throws Exception {
        // Create the OffrePoste with an existing ID
        offrePoste.setId(1L);

        int databaseSizeBeforeCreate = offrePosteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOffrePosteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offrePoste)))
            .andExpect(status().isBadRequest());

        // Validate the OffrePoste in the database
        List<OffrePoste> offrePosteList = offrePosteRepository.findAll();
        assertThat(offrePosteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNbrIsRequired() throws Exception {
        int databaseSizeBeforeTest = offrePosteRepository.findAll().size();
        // set the field null
        offrePoste.setNbr(null);

        // Create the OffrePoste, which fails.

        restOffrePosteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offrePoste)))
            .andExpect(status().isBadRequest());

        List<OffrePoste> offrePosteList = offrePosteRepository.findAll();
        assertThat(offrePosteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOffrePostes() throws Exception {
        // Initialize the database
        offrePosteRepository.saveAndFlush(offrePoste);

        // Get all the offrePosteList
        restOffrePosteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(offrePoste.getId().intValue())))
            .andExpect(jsonPath("$.[*].nbr").value(hasItem(DEFAULT_NBR)))
            .andExpect(jsonPath("$.[*].exigence").value(hasItem(DEFAULT_EXIGENCE)));
    }

    @Test
    @Transactional
    void getOffrePoste() throws Exception {
        // Initialize the database
        offrePosteRepository.saveAndFlush(offrePoste);

        // Get the offrePoste
        restOffrePosteMockMvc
            .perform(get(ENTITY_API_URL_ID, offrePoste.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(offrePoste.getId().intValue()))
            .andExpect(jsonPath("$.nbr").value(DEFAULT_NBR))
            .andExpect(jsonPath("$.exigence").value(DEFAULT_EXIGENCE));
    }

    @Test
    @Transactional
    void getNonExistingOffrePoste() throws Exception {
        // Get the offrePoste
        restOffrePosteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOffrePoste() throws Exception {
        // Initialize the database
        offrePosteRepository.saveAndFlush(offrePoste);

        int databaseSizeBeforeUpdate = offrePosteRepository.findAll().size();

        // Update the offrePoste
        OffrePoste updatedOffrePoste = offrePosteRepository.findById(offrePoste.getId()).get();
        // Disconnect from session so that the updates on updatedOffrePoste are not directly saved in db
        em.detach(updatedOffrePoste);
        updatedOffrePoste.nbr(UPDATED_NBR).exigence(UPDATED_EXIGENCE);

        restOffrePosteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOffrePoste.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOffrePoste))
            )
            .andExpect(status().isOk());

        // Validate the OffrePoste in the database
        List<OffrePoste> offrePosteList = offrePosteRepository.findAll();
        assertThat(offrePosteList).hasSize(databaseSizeBeforeUpdate);
        OffrePoste testOffrePoste = offrePosteList.get(offrePosteList.size() - 1);
        assertThat(testOffrePoste.getNbr()).isEqualTo(UPDATED_NBR);
        assertThat(testOffrePoste.getExigence()).isEqualTo(UPDATED_EXIGENCE);
    }

    @Test
    @Transactional
    void putNonExistingOffrePoste() throws Exception {
        int databaseSizeBeforeUpdate = offrePosteRepository.findAll().size();
        offrePoste.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOffrePosteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, offrePoste.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(offrePoste))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffrePoste in the database
        List<OffrePoste> offrePosteList = offrePosteRepository.findAll();
        assertThat(offrePosteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOffrePoste() throws Exception {
        int databaseSizeBeforeUpdate = offrePosteRepository.findAll().size();
        offrePoste.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffrePosteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(offrePoste))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffrePoste in the database
        List<OffrePoste> offrePosteList = offrePosteRepository.findAll();
        assertThat(offrePosteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOffrePoste() throws Exception {
        int databaseSizeBeforeUpdate = offrePosteRepository.findAll().size();
        offrePoste.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffrePosteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(offrePoste)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OffrePoste in the database
        List<OffrePoste> offrePosteList = offrePosteRepository.findAll();
        assertThat(offrePosteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOffrePosteWithPatch() throws Exception {
        // Initialize the database
        offrePosteRepository.saveAndFlush(offrePoste);

        int databaseSizeBeforeUpdate = offrePosteRepository.findAll().size();

        // Update the offrePoste using partial update
        OffrePoste partialUpdatedOffrePoste = new OffrePoste();
        partialUpdatedOffrePoste.setId(offrePoste.getId());

        restOffrePosteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOffrePoste.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOffrePoste))
            )
            .andExpect(status().isOk());

        // Validate the OffrePoste in the database
        List<OffrePoste> offrePosteList = offrePosteRepository.findAll();
        assertThat(offrePosteList).hasSize(databaseSizeBeforeUpdate);
        OffrePoste testOffrePoste = offrePosteList.get(offrePosteList.size() - 1);
        assertThat(testOffrePoste.getNbr()).isEqualTo(DEFAULT_NBR);
        assertThat(testOffrePoste.getExigence()).isEqualTo(DEFAULT_EXIGENCE);
    }

    @Test
    @Transactional
    void fullUpdateOffrePosteWithPatch() throws Exception {
        // Initialize the database
        offrePosteRepository.saveAndFlush(offrePoste);

        int databaseSizeBeforeUpdate = offrePosteRepository.findAll().size();

        // Update the offrePoste using partial update
        OffrePoste partialUpdatedOffrePoste = new OffrePoste();
        partialUpdatedOffrePoste.setId(offrePoste.getId());

        partialUpdatedOffrePoste.nbr(UPDATED_NBR).exigence(UPDATED_EXIGENCE);

        restOffrePosteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOffrePoste.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOffrePoste))
            )
            .andExpect(status().isOk());

        // Validate the OffrePoste in the database
        List<OffrePoste> offrePosteList = offrePosteRepository.findAll();
        assertThat(offrePosteList).hasSize(databaseSizeBeforeUpdate);
        OffrePoste testOffrePoste = offrePosteList.get(offrePosteList.size() - 1);
        assertThat(testOffrePoste.getNbr()).isEqualTo(UPDATED_NBR);
        assertThat(testOffrePoste.getExigence()).isEqualTo(UPDATED_EXIGENCE);
    }

    @Test
    @Transactional
    void patchNonExistingOffrePoste() throws Exception {
        int databaseSizeBeforeUpdate = offrePosteRepository.findAll().size();
        offrePoste.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOffrePosteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, offrePoste.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(offrePoste))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffrePoste in the database
        List<OffrePoste> offrePosteList = offrePosteRepository.findAll();
        assertThat(offrePosteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOffrePoste() throws Exception {
        int databaseSizeBeforeUpdate = offrePosteRepository.findAll().size();
        offrePoste.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffrePosteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(offrePoste))
            )
            .andExpect(status().isBadRequest());

        // Validate the OffrePoste in the database
        List<OffrePoste> offrePosteList = offrePosteRepository.findAll();
        assertThat(offrePosteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOffrePoste() throws Exception {
        int databaseSizeBeforeUpdate = offrePosteRepository.findAll().size();
        offrePoste.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOffrePosteMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(offrePoste))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OffrePoste in the database
        List<OffrePoste> offrePosteList = offrePosteRepository.findAll();
        assertThat(offrePosteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOffrePoste() throws Exception {
        // Initialize the database
        offrePosteRepository.saveAndFlush(offrePoste);

        int databaseSizeBeforeDelete = offrePosteRepository.findAll().size();

        // Delete the offrePoste
        restOffrePosteMockMvc
            .perform(delete(ENTITY_API_URL_ID, offrePoste.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OffrePoste> offrePosteList = offrePosteRepository.findAll();
        assertThat(offrePosteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
