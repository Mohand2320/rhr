package dz.enageo.rhr.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import dz.enageo.rhr.IntegrationTest;
import dz.enageo.rhr.domain.CandidatExamen;
import dz.enageo.rhr.domain.enumeration.Situation;
import dz.enageo.rhr.repository.CandidatExamenRepository;
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
 * Integration tests for the {@link CandidatExamenResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CandidatExamenResourceIT {

    private static final Boolean DEFAULT_PRESENT = false;
    private static final Boolean UPDATED_PRESENT = true;

    private static final Boolean DEFAULT_ADMIS = false;
    private static final Boolean UPDATED_ADMIS = true;

    private static final Boolean DEFAULT_RESERVE = false;
    private static final Boolean UPDATED_RESERVE = true;

    private static final Situation DEFAULT_SITUATION = Situation.SITUATION1;
    private static final Situation UPDATED_SITUATION = Situation.SITUATION1;

    private static final String ENTITY_API_URL = "/api/candidat-examen";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CandidatExamenRepository candidatExamenRepository;

    @Mock
    private CandidatExamenRepository candidatExamenRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCandidatExamenMockMvc;

    private CandidatExamen candidatExamen;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CandidatExamen createEntity(EntityManager em) {
        CandidatExamen candidatExamen = new CandidatExamen()
            .present(DEFAULT_PRESENT)
            .admis(DEFAULT_ADMIS)
            .reserve(DEFAULT_RESERVE)
            .situation(DEFAULT_SITUATION);
        return candidatExamen;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CandidatExamen createUpdatedEntity(EntityManager em) {
        CandidatExamen candidatExamen = new CandidatExamen()
            .present(UPDATED_PRESENT)
            .admis(UPDATED_ADMIS)
            .reserve(UPDATED_RESERVE)
            .situation(UPDATED_SITUATION);
        return candidatExamen;
    }

    @BeforeEach
    public void initTest() {
        candidatExamen = createEntity(em);
    }

    @Test
    @Transactional
    void createCandidatExamen() throws Exception {
        int databaseSizeBeforeCreate = candidatExamenRepository.findAll().size();
        // Create the CandidatExamen
        restCandidatExamenMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(candidatExamen))
            )
            .andExpect(status().isCreated());

        // Validate the CandidatExamen in the database
        List<CandidatExamen> candidatExamenList = candidatExamenRepository.findAll();
        assertThat(candidatExamenList).hasSize(databaseSizeBeforeCreate + 1);
        CandidatExamen testCandidatExamen = candidatExamenList.get(candidatExamenList.size() - 1);
        assertThat(testCandidatExamen.getPresent()).isEqualTo(DEFAULT_PRESENT);
        assertThat(testCandidatExamen.getAdmis()).isEqualTo(DEFAULT_ADMIS);
        assertThat(testCandidatExamen.getReserve()).isEqualTo(DEFAULT_RESERVE);
        assertThat(testCandidatExamen.getSituation()).isEqualTo(DEFAULT_SITUATION);
    }

    @Test
    @Transactional
    void createCandidatExamenWithExistingId() throws Exception {
        // Create the CandidatExamen with an existing ID
        candidatExamen.setId(1L);

        int databaseSizeBeforeCreate = candidatExamenRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCandidatExamenMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(candidatExamen))
            )
            .andExpect(status().isBadRequest());

        // Validate the CandidatExamen in the database
        List<CandidatExamen> candidatExamenList = candidatExamenRepository.findAll();
        assertThat(candidatExamenList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCandidatExamen() throws Exception {
        // Initialize the database
        candidatExamenRepository.saveAndFlush(candidatExamen);

        // Get all the candidatExamenList
        restCandidatExamenMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(candidatExamen.getId().intValue())))
            .andExpect(jsonPath("$.[*].present").value(hasItem(DEFAULT_PRESENT.booleanValue())))
            .andExpect(jsonPath("$.[*].admis").value(hasItem(DEFAULT_ADMIS.booleanValue())))
            .andExpect(jsonPath("$.[*].reserve").value(hasItem(DEFAULT_RESERVE.booleanValue())))
            .andExpect(jsonPath("$.[*].situation").value(hasItem(DEFAULT_SITUATION.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCandidatExamenWithEagerRelationshipsIsEnabled() throws Exception {
        when(candidatExamenRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCandidatExamenMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(candidatExamenRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCandidatExamenWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(candidatExamenRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCandidatExamenMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(candidatExamenRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getCandidatExamen() throws Exception {
        // Initialize the database
        candidatExamenRepository.saveAndFlush(candidatExamen);

        // Get the candidatExamen
        restCandidatExamenMockMvc
            .perform(get(ENTITY_API_URL_ID, candidatExamen.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(candidatExamen.getId().intValue()))
            .andExpect(jsonPath("$.present").value(DEFAULT_PRESENT.booleanValue()))
            .andExpect(jsonPath("$.admis").value(DEFAULT_ADMIS.booleanValue()))
            .andExpect(jsonPath("$.reserve").value(DEFAULT_RESERVE.booleanValue()))
            .andExpect(jsonPath("$.situation").value(DEFAULT_SITUATION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCandidatExamen() throws Exception {
        // Get the candidatExamen
        restCandidatExamenMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCandidatExamen() throws Exception {
        // Initialize the database
        candidatExamenRepository.saveAndFlush(candidatExamen);

        int databaseSizeBeforeUpdate = candidatExamenRepository.findAll().size();

        // Update the candidatExamen
        CandidatExamen updatedCandidatExamen = candidatExamenRepository.findById(candidatExamen.getId()).get();
        // Disconnect from session so that the updates on updatedCandidatExamen are not directly saved in db
        em.detach(updatedCandidatExamen);
        updatedCandidatExamen.present(UPDATED_PRESENT).admis(UPDATED_ADMIS).reserve(UPDATED_RESERVE).situation(UPDATED_SITUATION);

        restCandidatExamenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCandidatExamen.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCandidatExamen))
            )
            .andExpect(status().isOk());

        // Validate the CandidatExamen in the database
        List<CandidatExamen> candidatExamenList = candidatExamenRepository.findAll();
        assertThat(candidatExamenList).hasSize(databaseSizeBeforeUpdate);
        CandidatExamen testCandidatExamen = candidatExamenList.get(candidatExamenList.size() - 1);
        assertThat(testCandidatExamen.getPresent()).isEqualTo(UPDATED_PRESENT);
        assertThat(testCandidatExamen.getAdmis()).isEqualTo(UPDATED_ADMIS);
        assertThat(testCandidatExamen.getReserve()).isEqualTo(UPDATED_RESERVE);
        assertThat(testCandidatExamen.getSituation()).isEqualTo(UPDATED_SITUATION);
    }

    @Test
    @Transactional
    void putNonExistingCandidatExamen() throws Exception {
        int databaseSizeBeforeUpdate = candidatExamenRepository.findAll().size();
        candidatExamen.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCandidatExamenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, candidatExamen.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(candidatExamen))
            )
            .andExpect(status().isBadRequest());

        // Validate the CandidatExamen in the database
        List<CandidatExamen> candidatExamenList = candidatExamenRepository.findAll();
        assertThat(candidatExamenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCandidatExamen() throws Exception {
        int databaseSizeBeforeUpdate = candidatExamenRepository.findAll().size();
        candidatExamen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCandidatExamenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(candidatExamen))
            )
            .andExpect(status().isBadRequest());

        // Validate the CandidatExamen in the database
        List<CandidatExamen> candidatExamenList = candidatExamenRepository.findAll();
        assertThat(candidatExamenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCandidatExamen() throws Exception {
        int databaseSizeBeforeUpdate = candidatExamenRepository.findAll().size();
        candidatExamen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCandidatExamenMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(candidatExamen)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CandidatExamen in the database
        List<CandidatExamen> candidatExamenList = candidatExamenRepository.findAll();
        assertThat(candidatExamenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCandidatExamenWithPatch() throws Exception {
        // Initialize the database
        candidatExamenRepository.saveAndFlush(candidatExamen);

        int databaseSizeBeforeUpdate = candidatExamenRepository.findAll().size();

        // Update the candidatExamen using partial update
        CandidatExamen partialUpdatedCandidatExamen = new CandidatExamen();
        partialUpdatedCandidatExamen.setId(candidatExamen.getId());

        partialUpdatedCandidatExamen.situation(UPDATED_SITUATION);

        restCandidatExamenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCandidatExamen.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCandidatExamen))
            )
            .andExpect(status().isOk());

        // Validate the CandidatExamen in the database
        List<CandidatExamen> candidatExamenList = candidatExamenRepository.findAll();
        assertThat(candidatExamenList).hasSize(databaseSizeBeforeUpdate);
        CandidatExamen testCandidatExamen = candidatExamenList.get(candidatExamenList.size() - 1);
        assertThat(testCandidatExamen.getPresent()).isEqualTo(DEFAULT_PRESENT);
        assertThat(testCandidatExamen.getAdmis()).isEqualTo(DEFAULT_ADMIS);
        assertThat(testCandidatExamen.getReserve()).isEqualTo(DEFAULT_RESERVE);
        assertThat(testCandidatExamen.getSituation()).isEqualTo(UPDATED_SITUATION);
    }

    @Test
    @Transactional
    void fullUpdateCandidatExamenWithPatch() throws Exception {
        // Initialize the database
        candidatExamenRepository.saveAndFlush(candidatExamen);

        int databaseSizeBeforeUpdate = candidatExamenRepository.findAll().size();

        // Update the candidatExamen using partial update
        CandidatExamen partialUpdatedCandidatExamen = new CandidatExamen();
        partialUpdatedCandidatExamen.setId(candidatExamen.getId());

        partialUpdatedCandidatExamen.present(UPDATED_PRESENT).admis(UPDATED_ADMIS).reserve(UPDATED_RESERVE).situation(UPDATED_SITUATION);

        restCandidatExamenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCandidatExamen.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCandidatExamen))
            )
            .andExpect(status().isOk());

        // Validate the CandidatExamen in the database
        List<CandidatExamen> candidatExamenList = candidatExamenRepository.findAll();
        assertThat(candidatExamenList).hasSize(databaseSizeBeforeUpdate);
        CandidatExamen testCandidatExamen = candidatExamenList.get(candidatExamenList.size() - 1);
        assertThat(testCandidatExamen.getPresent()).isEqualTo(UPDATED_PRESENT);
        assertThat(testCandidatExamen.getAdmis()).isEqualTo(UPDATED_ADMIS);
        assertThat(testCandidatExamen.getReserve()).isEqualTo(UPDATED_RESERVE);
        assertThat(testCandidatExamen.getSituation()).isEqualTo(UPDATED_SITUATION);
    }

    @Test
    @Transactional
    void patchNonExistingCandidatExamen() throws Exception {
        int databaseSizeBeforeUpdate = candidatExamenRepository.findAll().size();
        candidatExamen.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCandidatExamenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, candidatExamen.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(candidatExamen))
            )
            .andExpect(status().isBadRequest());

        // Validate the CandidatExamen in the database
        List<CandidatExamen> candidatExamenList = candidatExamenRepository.findAll();
        assertThat(candidatExamenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCandidatExamen() throws Exception {
        int databaseSizeBeforeUpdate = candidatExamenRepository.findAll().size();
        candidatExamen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCandidatExamenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(candidatExamen))
            )
            .andExpect(status().isBadRequest());

        // Validate the CandidatExamen in the database
        List<CandidatExamen> candidatExamenList = candidatExamenRepository.findAll();
        assertThat(candidatExamenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCandidatExamen() throws Exception {
        int databaseSizeBeforeUpdate = candidatExamenRepository.findAll().size();
        candidatExamen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCandidatExamenMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(candidatExamen))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CandidatExamen in the database
        List<CandidatExamen> candidatExamenList = candidatExamenRepository.findAll();
        assertThat(candidatExamenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCandidatExamen() throws Exception {
        // Initialize the database
        candidatExamenRepository.saveAndFlush(candidatExamen);

        int databaseSizeBeforeDelete = candidatExamenRepository.findAll().size();

        // Delete the candidatExamen
        restCandidatExamenMockMvc
            .perform(delete(ENTITY_API_URL_ID, candidatExamen.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CandidatExamen> candidatExamenList = candidatExamenRepository.findAll();
        assertThat(candidatExamenList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
