package dz.enageo.rhr.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import dz.enageo.rhr.IntegrationTest;
import dz.enageo.rhr.domain.OrientationCandidat;
import dz.enageo.rhr.repository.OrientationCandidatRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link OrientationCandidatResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class OrientationCandidatResourceIT {

    private static final LocalDate DEFAULT_DATE_ORIENTATION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_ORIENTATION = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/orientation-candidats";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OrientationCandidatRepository orientationCandidatRepository;

    @Mock
    private OrientationCandidatRepository orientationCandidatRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrientationCandidatMockMvc;

    private OrientationCandidat orientationCandidat;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrientationCandidat createEntity(EntityManager em) {
        OrientationCandidat orientationCandidat = new OrientationCandidat().dateOrientation(DEFAULT_DATE_ORIENTATION);
        return orientationCandidat;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrientationCandidat createUpdatedEntity(EntityManager em) {
        OrientationCandidat orientationCandidat = new OrientationCandidat().dateOrientation(UPDATED_DATE_ORIENTATION);
        return orientationCandidat;
    }

    @BeforeEach
    public void initTest() {
        orientationCandidat = createEntity(em);
    }

    @Test
    @Transactional
    void createOrientationCandidat() throws Exception {
        int databaseSizeBeforeCreate = orientationCandidatRepository.findAll().size();
        // Create the OrientationCandidat
        restOrientationCandidatMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orientationCandidat))
            )
            .andExpect(status().isCreated());

        // Validate the OrientationCandidat in the database
        List<OrientationCandidat> orientationCandidatList = orientationCandidatRepository.findAll();
        assertThat(orientationCandidatList).hasSize(databaseSizeBeforeCreate + 1);
        OrientationCandidat testOrientationCandidat = orientationCandidatList.get(orientationCandidatList.size() - 1);
        assertThat(testOrientationCandidat.getDateOrientation()).isEqualTo(DEFAULT_DATE_ORIENTATION);
    }

    @Test
    @Transactional
    void createOrientationCandidatWithExistingId() throws Exception {
        // Create the OrientationCandidat with an existing ID
        orientationCandidat.setId(1L);

        int databaseSizeBeforeCreate = orientationCandidatRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrientationCandidatMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orientationCandidat))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrientationCandidat in the database
        List<OrientationCandidat> orientationCandidatList = orientationCandidatRepository.findAll();
        assertThat(orientationCandidatList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOrientationCandidats() throws Exception {
        // Initialize the database
        orientationCandidatRepository.saveAndFlush(orientationCandidat);

        // Get all the orientationCandidatList
        restOrientationCandidatMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orientationCandidat.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateOrientation").value(hasItem(DEFAULT_DATE_ORIENTATION.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllOrientationCandidatsWithEagerRelationshipsIsEnabled() throws Exception {
        when(orientationCandidatRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restOrientationCandidatMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(orientationCandidatRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllOrientationCandidatsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(orientationCandidatRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restOrientationCandidatMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(orientationCandidatRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getOrientationCandidat() throws Exception {
        // Initialize the database
        orientationCandidatRepository.saveAndFlush(orientationCandidat);

        // Get the orientationCandidat
        restOrientationCandidatMockMvc
            .perform(get(ENTITY_API_URL_ID, orientationCandidat.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(orientationCandidat.getId().intValue()))
            .andExpect(jsonPath("$.dateOrientation").value(DEFAULT_DATE_ORIENTATION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingOrientationCandidat() throws Exception {
        // Get the orientationCandidat
        restOrientationCandidatMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOrientationCandidat() throws Exception {
        // Initialize the database
        orientationCandidatRepository.saveAndFlush(orientationCandidat);

        int databaseSizeBeforeUpdate = orientationCandidatRepository.findAll().size();

        // Update the orientationCandidat
        OrientationCandidat updatedOrientationCandidat = orientationCandidatRepository.findById(orientationCandidat.getId()).get();
        // Disconnect from session so that the updates on updatedOrientationCandidat are not directly saved in db
        em.detach(updatedOrientationCandidat);
        updatedOrientationCandidat.dateOrientation(UPDATED_DATE_ORIENTATION);

        restOrientationCandidatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrientationCandidat.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrientationCandidat))
            )
            .andExpect(status().isOk());

        // Validate the OrientationCandidat in the database
        List<OrientationCandidat> orientationCandidatList = orientationCandidatRepository.findAll();
        assertThat(orientationCandidatList).hasSize(databaseSizeBeforeUpdate);
        OrientationCandidat testOrientationCandidat = orientationCandidatList.get(orientationCandidatList.size() - 1);
        assertThat(testOrientationCandidat.getDateOrientation()).isEqualTo(UPDATED_DATE_ORIENTATION);
    }

    @Test
    @Transactional
    void putNonExistingOrientationCandidat() throws Exception {
        int databaseSizeBeforeUpdate = orientationCandidatRepository.findAll().size();
        orientationCandidat.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrientationCandidatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, orientationCandidat.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orientationCandidat))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrientationCandidat in the database
        List<OrientationCandidat> orientationCandidatList = orientationCandidatRepository.findAll();
        assertThat(orientationCandidatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrientationCandidat() throws Exception {
        int databaseSizeBeforeUpdate = orientationCandidatRepository.findAll().size();
        orientationCandidat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrientationCandidatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orientationCandidat))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrientationCandidat in the database
        List<OrientationCandidat> orientationCandidatList = orientationCandidatRepository.findAll();
        assertThat(orientationCandidatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrientationCandidat() throws Exception {
        int databaseSizeBeforeUpdate = orientationCandidatRepository.findAll().size();
        orientationCandidat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrientationCandidatMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orientationCandidat))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrientationCandidat in the database
        List<OrientationCandidat> orientationCandidatList = orientationCandidatRepository.findAll();
        assertThat(orientationCandidatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrientationCandidatWithPatch() throws Exception {
        // Initialize the database
        orientationCandidatRepository.saveAndFlush(orientationCandidat);

        int databaseSizeBeforeUpdate = orientationCandidatRepository.findAll().size();

        // Update the orientationCandidat using partial update
        OrientationCandidat partialUpdatedOrientationCandidat = new OrientationCandidat();
        partialUpdatedOrientationCandidat.setId(orientationCandidat.getId());

        restOrientationCandidatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrientationCandidat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrientationCandidat))
            )
            .andExpect(status().isOk());

        // Validate the OrientationCandidat in the database
        List<OrientationCandidat> orientationCandidatList = orientationCandidatRepository.findAll();
        assertThat(orientationCandidatList).hasSize(databaseSizeBeforeUpdate);
        OrientationCandidat testOrientationCandidat = orientationCandidatList.get(orientationCandidatList.size() - 1);
        assertThat(testOrientationCandidat.getDateOrientation()).isEqualTo(DEFAULT_DATE_ORIENTATION);
    }

    @Test
    @Transactional
    void fullUpdateOrientationCandidatWithPatch() throws Exception {
        // Initialize the database
        orientationCandidatRepository.saveAndFlush(orientationCandidat);

        int databaseSizeBeforeUpdate = orientationCandidatRepository.findAll().size();

        // Update the orientationCandidat using partial update
        OrientationCandidat partialUpdatedOrientationCandidat = new OrientationCandidat();
        partialUpdatedOrientationCandidat.setId(orientationCandidat.getId());

        partialUpdatedOrientationCandidat.dateOrientation(UPDATED_DATE_ORIENTATION);

        restOrientationCandidatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrientationCandidat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrientationCandidat))
            )
            .andExpect(status().isOk());

        // Validate the OrientationCandidat in the database
        List<OrientationCandidat> orientationCandidatList = orientationCandidatRepository.findAll();
        assertThat(orientationCandidatList).hasSize(databaseSizeBeforeUpdate);
        OrientationCandidat testOrientationCandidat = orientationCandidatList.get(orientationCandidatList.size() - 1);
        assertThat(testOrientationCandidat.getDateOrientation()).isEqualTo(UPDATED_DATE_ORIENTATION);
    }

    @Test
    @Transactional
    void patchNonExistingOrientationCandidat() throws Exception {
        int databaseSizeBeforeUpdate = orientationCandidatRepository.findAll().size();
        orientationCandidat.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrientationCandidatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, orientationCandidat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orientationCandidat))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrientationCandidat in the database
        List<OrientationCandidat> orientationCandidatList = orientationCandidatRepository.findAll();
        assertThat(orientationCandidatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrientationCandidat() throws Exception {
        int databaseSizeBeforeUpdate = orientationCandidatRepository.findAll().size();
        orientationCandidat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrientationCandidatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orientationCandidat))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrientationCandidat in the database
        List<OrientationCandidat> orientationCandidatList = orientationCandidatRepository.findAll();
        assertThat(orientationCandidatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrientationCandidat() throws Exception {
        int databaseSizeBeforeUpdate = orientationCandidatRepository.findAll().size();
        orientationCandidat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrientationCandidatMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orientationCandidat))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrientationCandidat in the database
        List<OrientationCandidat> orientationCandidatList = orientationCandidatRepository.findAll();
        assertThat(orientationCandidatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrientationCandidat() throws Exception {
        // Initialize the database
        orientationCandidatRepository.saveAndFlush(orientationCandidat);

        int databaseSizeBeforeDelete = orientationCandidatRepository.findAll().size();

        // Delete the orientationCandidat
        restOrientationCandidatMockMvc
            .perform(delete(ENTITY_API_URL_ID, orientationCandidat.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrientationCandidat> orientationCandidatList = orientationCandidatRepository.findAll();
        assertThat(orientationCandidatList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
