package dz.enageo.rhr.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import dz.enageo.rhr.IntegrationTest;
import dz.enageo.rhr.domain.PrevisionPoste;
import dz.enageo.rhr.repository.PrevisionPosteRepository;
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
 * Integration tests for the {@link PrevisionPosteResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PrevisionPosteResourceIT {

    private static final LocalDate DEFAULT_DATE_AJOUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_AJOUT = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/prevision-postes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PrevisionPosteRepository previsionPosteRepository;

    @Mock
    private PrevisionPosteRepository previsionPosteRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPrevisionPosteMockMvc;

    private PrevisionPoste previsionPoste;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PrevisionPoste createEntity(EntityManager em) {
        PrevisionPoste previsionPoste = new PrevisionPoste().dateAjout(DEFAULT_DATE_AJOUT);
        return previsionPoste;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PrevisionPoste createUpdatedEntity(EntityManager em) {
        PrevisionPoste previsionPoste = new PrevisionPoste().dateAjout(UPDATED_DATE_AJOUT);
        return previsionPoste;
    }

    @BeforeEach
    public void initTest() {
        previsionPoste = createEntity(em);
    }

    @Test
    @Transactional
    void createPrevisionPoste() throws Exception {
        int databaseSizeBeforeCreate = previsionPosteRepository.findAll().size();
        // Create the PrevisionPoste
        restPrevisionPosteMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(previsionPoste))
            )
            .andExpect(status().isCreated());

        // Validate the PrevisionPoste in the database
        List<PrevisionPoste> previsionPosteList = previsionPosteRepository.findAll();
        assertThat(previsionPosteList).hasSize(databaseSizeBeforeCreate + 1);
        PrevisionPoste testPrevisionPoste = previsionPosteList.get(previsionPosteList.size() - 1);
        assertThat(testPrevisionPoste.getDateAjout()).isEqualTo(DEFAULT_DATE_AJOUT);
    }

    @Test
    @Transactional
    void createPrevisionPosteWithExistingId() throws Exception {
        // Create the PrevisionPoste with an existing ID
        previsionPoste.setId(1L);

        int databaseSizeBeforeCreate = previsionPosteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPrevisionPosteMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(previsionPoste))
            )
            .andExpect(status().isBadRequest());

        // Validate the PrevisionPoste in the database
        List<PrevisionPoste> previsionPosteList = previsionPosteRepository.findAll();
        assertThat(previsionPosteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPrevisionPostes() throws Exception {
        // Initialize the database
        previsionPosteRepository.saveAndFlush(previsionPoste);

        // Get all the previsionPosteList
        restPrevisionPosteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(previsionPoste.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateAjout").value(hasItem(DEFAULT_DATE_AJOUT.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPrevisionPostesWithEagerRelationshipsIsEnabled() throws Exception {
        when(previsionPosteRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPrevisionPosteMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(previsionPosteRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPrevisionPostesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(previsionPosteRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPrevisionPosteMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(previsionPosteRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getPrevisionPoste() throws Exception {
        // Initialize the database
        previsionPosteRepository.saveAndFlush(previsionPoste);

        // Get the previsionPoste
        restPrevisionPosteMockMvc
            .perform(get(ENTITY_API_URL_ID, previsionPoste.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(previsionPoste.getId().intValue()))
            .andExpect(jsonPath("$.dateAjout").value(DEFAULT_DATE_AJOUT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPrevisionPoste() throws Exception {
        // Get the previsionPoste
        restPrevisionPosteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPrevisionPoste() throws Exception {
        // Initialize the database
        previsionPosteRepository.saveAndFlush(previsionPoste);

        int databaseSizeBeforeUpdate = previsionPosteRepository.findAll().size();

        // Update the previsionPoste
        PrevisionPoste updatedPrevisionPoste = previsionPosteRepository.findById(previsionPoste.getId()).get();
        // Disconnect from session so that the updates on updatedPrevisionPoste are not directly saved in db
        em.detach(updatedPrevisionPoste);
        updatedPrevisionPoste.dateAjout(UPDATED_DATE_AJOUT);

        restPrevisionPosteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPrevisionPoste.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPrevisionPoste))
            )
            .andExpect(status().isOk());

        // Validate the PrevisionPoste in the database
        List<PrevisionPoste> previsionPosteList = previsionPosteRepository.findAll();
        assertThat(previsionPosteList).hasSize(databaseSizeBeforeUpdate);
        PrevisionPoste testPrevisionPoste = previsionPosteList.get(previsionPosteList.size() - 1);
        assertThat(testPrevisionPoste.getDateAjout()).isEqualTo(UPDATED_DATE_AJOUT);
    }

    @Test
    @Transactional
    void putNonExistingPrevisionPoste() throws Exception {
        int databaseSizeBeforeUpdate = previsionPosteRepository.findAll().size();
        previsionPoste.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPrevisionPosteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, previsionPoste.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(previsionPoste))
            )
            .andExpect(status().isBadRequest());

        // Validate the PrevisionPoste in the database
        List<PrevisionPoste> previsionPosteList = previsionPosteRepository.findAll();
        assertThat(previsionPosteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPrevisionPoste() throws Exception {
        int databaseSizeBeforeUpdate = previsionPosteRepository.findAll().size();
        previsionPoste.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPrevisionPosteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(previsionPoste))
            )
            .andExpect(status().isBadRequest());

        // Validate the PrevisionPoste in the database
        List<PrevisionPoste> previsionPosteList = previsionPosteRepository.findAll();
        assertThat(previsionPosteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPrevisionPoste() throws Exception {
        int databaseSizeBeforeUpdate = previsionPosteRepository.findAll().size();
        previsionPoste.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPrevisionPosteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(previsionPoste)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PrevisionPoste in the database
        List<PrevisionPoste> previsionPosteList = previsionPosteRepository.findAll();
        assertThat(previsionPosteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePrevisionPosteWithPatch() throws Exception {
        // Initialize the database
        previsionPosteRepository.saveAndFlush(previsionPoste);

        int databaseSizeBeforeUpdate = previsionPosteRepository.findAll().size();

        // Update the previsionPoste using partial update
        PrevisionPoste partialUpdatedPrevisionPoste = new PrevisionPoste();
        partialUpdatedPrevisionPoste.setId(previsionPoste.getId());

        partialUpdatedPrevisionPoste.dateAjout(UPDATED_DATE_AJOUT);

        restPrevisionPosteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPrevisionPoste.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPrevisionPoste))
            )
            .andExpect(status().isOk());

        // Validate the PrevisionPoste in the database
        List<PrevisionPoste> previsionPosteList = previsionPosteRepository.findAll();
        assertThat(previsionPosteList).hasSize(databaseSizeBeforeUpdate);
        PrevisionPoste testPrevisionPoste = previsionPosteList.get(previsionPosteList.size() - 1);
        assertThat(testPrevisionPoste.getDateAjout()).isEqualTo(UPDATED_DATE_AJOUT);
    }

    @Test
    @Transactional
    void fullUpdatePrevisionPosteWithPatch() throws Exception {
        // Initialize the database
        previsionPosteRepository.saveAndFlush(previsionPoste);

        int databaseSizeBeforeUpdate = previsionPosteRepository.findAll().size();

        // Update the previsionPoste using partial update
        PrevisionPoste partialUpdatedPrevisionPoste = new PrevisionPoste();
        partialUpdatedPrevisionPoste.setId(previsionPoste.getId());

        partialUpdatedPrevisionPoste.dateAjout(UPDATED_DATE_AJOUT);

        restPrevisionPosteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPrevisionPoste.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPrevisionPoste))
            )
            .andExpect(status().isOk());

        // Validate the PrevisionPoste in the database
        List<PrevisionPoste> previsionPosteList = previsionPosteRepository.findAll();
        assertThat(previsionPosteList).hasSize(databaseSizeBeforeUpdate);
        PrevisionPoste testPrevisionPoste = previsionPosteList.get(previsionPosteList.size() - 1);
        assertThat(testPrevisionPoste.getDateAjout()).isEqualTo(UPDATED_DATE_AJOUT);
    }

    @Test
    @Transactional
    void patchNonExistingPrevisionPoste() throws Exception {
        int databaseSizeBeforeUpdate = previsionPosteRepository.findAll().size();
        previsionPoste.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPrevisionPosteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, previsionPoste.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(previsionPoste))
            )
            .andExpect(status().isBadRequest());

        // Validate the PrevisionPoste in the database
        List<PrevisionPoste> previsionPosteList = previsionPosteRepository.findAll();
        assertThat(previsionPosteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPrevisionPoste() throws Exception {
        int databaseSizeBeforeUpdate = previsionPosteRepository.findAll().size();
        previsionPoste.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPrevisionPosteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(previsionPoste))
            )
            .andExpect(status().isBadRequest());

        // Validate the PrevisionPoste in the database
        List<PrevisionPoste> previsionPosteList = previsionPosteRepository.findAll();
        assertThat(previsionPosteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPrevisionPoste() throws Exception {
        int databaseSizeBeforeUpdate = previsionPosteRepository.findAll().size();
        previsionPoste.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPrevisionPosteMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(previsionPoste))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PrevisionPoste in the database
        List<PrevisionPoste> previsionPosteList = previsionPosteRepository.findAll();
        assertThat(previsionPosteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePrevisionPoste() throws Exception {
        // Initialize the database
        previsionPosteRepository.saveAndFlush(previsionPoste);

        int databaseSizeBeforeDelete = previsionPosteRepository.findAll().size();

        // Delete the previsionPoste
        restPrevisionPosteMockMvc
            .perform(delete(ENTITY_API_URL_ID, previsionPoste.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PrevisionPoste> previsionPosteList = previsionPosteRepository.findAll();
        assertThat(previsionPosteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
