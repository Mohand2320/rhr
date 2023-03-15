package dz.enageo.rhr.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import dz.enageo.rhr.IntegrationTest;
import dz.enageo.rhr.domain.Orientation;
import dz.enageo.rhr.repository.OrientationRepository;
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
 * Integration tests for the {@link OrientationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrientationResourceIT {

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/orientations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OrientationRepository orientationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrientationMockMvc;

    private Orientation orientation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Orientation createEntity(EntityManager em) {
        Orientation orientation = new Orientation().libelle(DEFAULT_LIBELLE);
        return orientation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Orientation createUpdatedEntity(EntityManager em) {
        Orientation orientation = new Orientation().libelle(UPDATED_LIBELLE);
        return orientation;
    }

    @BeforeEach
    public void initTest() {
        orientation = createEntity(em);
    }

    @Test
    @Transactional
    void createOrientation() throws Exception {
        int databaseSizeBeforeCreate = orientationRepository.findAll().size();
        // Create the Orientation
        restOrientationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orientation)))
            .andExpect(status().isCreated());

        // Validate the Orientation in the database
        List<Orientation> orientationList = orientationRepository.findAll();
        assertThat(orientationList).hasSize(databaseSizeBeforeCreate + 1);
        Orientation testOrientation = orientationList.get(orientationList.size() - 1);
        assertThat(testOrientation.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
    }

    @Test
    @Transactional
    void createOrientationWithExistingId() throws Exception {
        // Create the Orientation with an existing ID
        orientation.setId(1L);

        int databaseSizeBeforeCreate = orientationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrientationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orientation)))
            .andExpect(status().isBadRequest());

        // Validate the Orientation in the database
        List<Orientation> orientationList = orientationRepository.findAll();
        assertThat(orientationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOrientations() throws Exception {
        // Initialize the database
        orientationRepository.saveAndFlush(orientation);

        // Get all the orientationList
        restOrientationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orientation.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)));
    }

    @Test
    @Transactional
    void getOrientation() throws Exception {
        // Initialize the database
        orientationRepository.saveAndFlush(orientation);

        // Get the orientation
        restOrientationMockMvc
            .perform(get(ENTITY_API_URL_ID, orientation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(orientation.getId().intValue()))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE));
    }

    @Test
    @Transactional
    void getNonExistingOrientation() throws Exception {
        // Get the orientation
        restOrientationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOrientation() throws Exception {
        // Initialize the database
        orientationRepository.saveAndFlush(orientation);

        int databaseSizeBeforeUpdate = orientationRepository.findAll().size();

        // Update the orientation
        Orientation updatedOrientation = orientationRepository.findById(orientation.getId()).get();
        // Disconnect from session so that the updates on updatedOrientation are not directly saved in db
        em.detach(updatedOrientation);
        updatedOrientation.libelle(UPDATED_LIBELLE);

        restOrientationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrientation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrientation))
            )
            .andExpect(status().isOk());

        // Validate the Orientation in the database
        List<Orientation> orientationList = orientationRepository.findAll();
        assertThat(orientationList).hasSize(databaseSizeBeforeUpdate);
        Orientation testOrientation = orientationList.get(orientationList.size() - 1);
        assertThat(testOrientation.getLibelle()).isEqualTo(UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void putNonExistingOrientation() throws Exception {
        int databaseSizeBeforeUpdate = orientationRepository.findAll().size();
        orientation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrientationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, orientation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orientation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Orientation in the database
        List<Orientation> orientationList = orientationRepository.findAll();
        assertThat(orientationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrientation() throws Exception {
        int databaseSizeBeforeUpdate = orientationRepository.findAll().size();
        orientation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrientationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orientation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Orientation in the database
        List<Orientation> orientationList = orientationRepository.findAll();
        assertThat(orientationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrientation() throws Exception {
        int databaseSizeBeforeUpdate = orientationRepository.findAll().size();
        orientation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrientationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orientation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Orientation in the database
        List<Orientation> orientationList = orientationRepository.findAll();
        assertThat(orientationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrientationWithPatch() throws Exception {
        // Initialize the database
        orientationRepository.saveAndFlush(orientation);

        int databaseSizeBeforeUpdate = orientationRepository.findAll().size();

        // Update the orientation using partial update
        Orientation partialUpdatedOrientation = new Orientation();
        partialUpdatedOrientation.setId(orientation.getId());

        partialUpdatedOrientation.libelle(UPDATED_LIBELLE);

        restOrientationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrientation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrientation))
            )
            .andExpect(status().isOk());

        // Validate the Orientation in the database
        List<Orientation> orientationList = orientationRepository.findAll();
        assertThat(orientationList).hasSize(databaseSizeBeforeUpdate);
        Orientation testOrientation = orientationList.get(orientationList.size() - 1);
        assertThat(testOrientation.getLibelle()).isEqualTo(UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void fullUpdateOrientationWithPatch() throws Exception {
        // Initialize the database
        orientationRepository.saveAndFlush(orientation);

        int databaseSizeBeforeUpdate = orientationRepository.findAll().size();

        // Update the orientation using partial update
        Orientation partialUpdatedOrientation = new Orientation();
        partialUpdatedOrientation.setId(orientation.getId());

        partialUpdatedOrientation.libelle(UPDATED_LIBELLE);

        restOrientationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrientation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrientation))
            )
            .andExpect(status().isOk());

        // Validate the Orientation in the database
        List<Orientation> orientationList = orientationRepository.findAll();
        assertThat(orientationList).hasSize(databaseSizeBeforeUpdate);
        Orientation testOrientation = orientationList.get(orientationList.size() - 1);
        assertThat(testOrientation.getLibelle()).isEqualTo(UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void patchNonExistingOrientation() throws Exception {
        int databaseSizeBeforeUpdate = orientationRepository.findAll().size();
        orientation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrientationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, orientation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orientation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Orientation in the database
        List<Orientation> orientationList = orientationRepository.findAll();
        assertThat(orientationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrientation() throws Exception {
        int databaseSizeBeforeUpdate = orientationRepository.findAll().size();
        orientation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrientationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orientation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Orientation in the database
        List<Orientation> orientationList = orientationRepository.findAll();
        assertThat(orientationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrientation() throws Exception {
        int databaseSizeBeforeUpdate = orientationRepository.findAll().size();
        orientation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrientationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(orientation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Orientation in the database
        List<Orientation> orientationList = orientationRepository.findAll();
        assertThat(orientationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrientation() throws Exception {
        // Initialize the database
        orientationRepository.saveAndFlush(orientation);

        int databaseSizeBeforeDelete = orientationRepository.findAll().size();

        // Delete the orientation
        restOrientationMockMvc
            .perform(delete(ENTITY_API_URL_ID, orientation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Orientation> orientationList = orientationRepository.findAll();
        assertThat(orientationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
