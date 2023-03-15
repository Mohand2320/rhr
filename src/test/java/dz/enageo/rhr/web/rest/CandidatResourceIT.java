package dz.enageo.rhr.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import dz.enageo.rhr.IntegrationTest;
import dz.enageo.rhr.domain.Candidat;
import dz.enageo.rhr.repository.CandidatRepository;
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
 * Integration tests for the {@link CandidatResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CandidatResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_NAISSANCE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_NAISSANCE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_TEL = "002473910581";
    private static final String UPDATED_TEL = "00906583008";

    private static final String DEFAULT_NUMERO_INSCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_INSCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/candidats";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CandidatRepository candidatRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCandidatMockMvc;

    private Candidat candidat;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Candidat createEntity(EntityManager em) {
        Candidat candidat = new Candidat()
            .nom(DEFAULT_NOM)
            .prenom(DEFAULT_PRENOM)
            .dateNaissance(DEFAULT_DATE_NAISSANCE)
            .tel(DEFAULT_TEL)
            .numeroInscription(DEFAULT_NUMERO_INSCRIPTION);
        return candidat;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Candidat createUpdatedEntity(EntityManager em) {
        Candidat candidat = new Candidat()
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .tel(UPDATED_TEL)
            .numeroInscription(UPDATED_NUMERO_INSCRIPTION);
        return candidat;
    }

    @BeforeEach
    public void initTest() {
        candidat = createEntity(em);
    }

    @Test
    @Transactional
    void createCandidat() throws Exception {
        int databaseSizeBeforeCreate = candidatRepository.findAll().size();
        // Create the Candidat
        restCandidatMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(candidat)))
            .andExpect(status().isCreated());

        // Validate the Candidat in the database
        List<Candidat> candidatList = candidatRepository.findAll();
        assertThat(candidatList).hasSize(databaseSizeBeforeCreate + 1);
        Candidat testCandidat = candidatList.get(candidatList.size() - 1);
        assertThat(testCandidat.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testCandidat.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testCandidat.getDateNaissance()).isEqualTo(DEFAULT_DATE_NAISSANCE);
        assertThat(testCandidat.getTel()).isEqualTo(DEFAULT_TEL);
        assertThat(testCandidat.getNumeroInscription()).isEqualTo(DEFAULT_NUMERO_INSCRIPTION);
    }

    @Test
    @Transactional
    void createCandidatWithExistingId() throws Exception {
        // Create the Candidat with an existing ID
        candidat.setId(1L);

        int databaseSizeBeforeCreate = candidatRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCandidatMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(candidat)))
            .andExpect(status().isBadRequest());

        // Validate the Candidat in the database
        List<Candidat> candidatList = candidatRepository.findAll();
        assertThat(candidatList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = candidatRepository.findAll().size();
        // set the field null
        candidat.setNom(null);

        // Create the Candidat, which fails.

        restCandidatMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(candidat)))
            .andExpect(status().isBadRequest());

        List<Candidat> candidatList = candidatRepository.findAll();
        assertThat(candidatList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrenomIsRequired() throws Exception {
        int databaseSizeBeforeTest = candidatRepository.findAll().size();
        // set the field null
        candidat.setPrenom(null);

        // Create the Candidat, which fails.

        restCandidatMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(candidat)))
            .andExpect(status().isBadRequest());

        List<Candidat> candidatList = candidatRepository.findAll();
        assertThat(candidatList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateNaissanceIsRequired() throws Exception {
        int databaseSizeBeforeTest = candidatRepository.findAll().size();
        // set the field null
        candidat.setDateNaissance(null);

        // Create the Candidat, which fails.

        restCandidatMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(candidat)))
            .andExpect(status().isBadRequest());

        List<Candidat> candidatList = candidatRepository.findAll();
        assertThat(candidatList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTelIsRequired() throws Exception {
        int databaseSizeBeforeTest = candidatRepository.findAll().size();
        // set the field null
        candidat.setTel(null);

        // Create the Candidat, which fails.

        restCandidatMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(candidat)))
            .andExpect(status().isBadRequest());

        List<Candidat> candidatList = candidatRepository.findAll();
        assertThat(candidatList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCandidats() throws Exception {
        // Initialize the database
        candidatRepository.saveAndFlush(candidat);

        // Get all the candidatList
        restCandidatMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(candidat.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)))
            .andExpect(jsonPath("$.[*].dateNaissance").value(hasItem(DEFAULT_DATE_NAISSANCE.toString())))
            .andExpect(jsonPath("$.[*].tel").value(hasItem(DEFAULT_TEL)))
            .andExpect(jsonPath("$.[*].numeroInscription").value(hasItem(DEFAULT_NUMERO_INSCRIPTION)));
    }

    @Test
    @Transactional
    void getCandidat() throws Exception {
        // Initialize the database
        candidatRepository.saveAndFlush(candidat);

        // Get the candidat
        restCandidatMockMvc
            .perform(get(ENTITY_API_URL_ID, candidat.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(candidat.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.prenom").value(DEFAULT_PRENOM))
            .andExpect(jsonPath("$.dateNaissance").value(DEFAULT_DATE_NAISSANCE.toString()))
            .andExpect(jsonPath("$.tel").value(DEFAULT_TEL))
            .andExpect(jsonPath("$.numeroInscription").value(DEFAULT_NUMERO_INSCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingCandidat() throws Exception {
        // Get the candidat
        restCandidatMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCandidat() throws Exception {
        // Initialize the database
        candidatRepository.saveAndFlush(candidat);

        int databaseSizeBeforeUpdate = candidatRepository.findAll().size();

        // Update the candidat
        Candidat updatedCandidat = candidatRepository.findById(candidat.getId()).get();
        // Disconnect from session so that the updates on updatedCandidat are not directly saved in db
        em.detach(updatedCandidat);
        updatedCandidat
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .tel(UPDATED_TEL)
            .numeroInscription(UPDATED_NUMERO_INSCRIPTION);

        restCandidatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCandidat.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCandidat))
            )
            .andExpect(status().isOk());

        // Validate the Candidat in the database
        List<Candidat> candidatList = candidatRepository.findAll();
        assertThat(candidatList).hasSize(databaseSizeBeforeUpdate);
        Candidat testCandidat = candidatList.get(candidatList.size() - 1);
        assertThat(testCandidat.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCandidat.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testCandidat.getDateNaissance()).isEqualTo(UPDATED_DATE_NAISSANCE);
        assertThat(testCandidat.getTel()).isEqualTo(UPDATED_TEL);
        assertThat(testCandidat.getNumeroInscription()).isEqualTo(UPDATED_NUMERO_INSCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingCandidat() throws Exception {
        int databaseSizeBeforeUpdate = candidatRepository.findAll().size();
        candidat.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCandidatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, candidat.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(candidat))
            )
            .andExpect(status().isBadRequest());

        // Validate the Candidat in the database
        List<Candidat> candidatList = candidatRepository.findAll();
        assertThat(candidatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCandidat() throws Exception {
        int databaseSizeBeforeUpdate = candidatRepository.findAll().size();
        candidat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCandidatMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(candidat))
            )
            .andExpect(status().isBadRequest());

        // Validate the Candidat in the database
        List<Candidat> candidatList = candidatRepository.findAll();
        assertThat(candidatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCandidat() throws Exception {
        int databaseSizeBeforeUpdate = candidatRepository.findAll().size();
        candidat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCandidatMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(candidat)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Candidat in the database
        List<Candidat> candidatList = candidatRepository.findAll();
        assertThat(candidatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCandidatWithPatch() throws Exception {
        // Initialize the database
        candidatRepository.saveAndFlush(candidat);

        int databaseSizeBeforeUpdate = candidatRepository.findAll().size();

        // Update the candidat using partial update
        Candidat partialUpdatedCandidat = new Candidat();
        partialUpdatedCandidat.setId(candidat.getId());

        partialUpdatedCandidat.nom(UPDATED_NOM).prenom(UPDATED_PRENOM).dateNaissance(UPDATED_DATE_NAISSANCE);

        restCandidatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCandidat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCandidat))
            )
            .andExpect(status().isOk());

        // Validate the Candidat in the database
        List<Candidat> candidatList = candidatRepository.findAll();
        assertThat(candidatList).hasSize(databaseSizeBeforeUpdate);
        Candidat testCandidat = candidatList.get(candidatList.size() - 1);
        assertThat(testCandidat.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCandidat.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testCandidat.getDateNaissance()).isEqualTo(UPDATED_DATE_NAISSANCE);
        assertThat(testCandidat.getTel()).isEqualTo(DEFAULT_TEL);
        assertThat(testCandidat.getNumeroInscription()).isEqualTo(DEFAULT_NUMERO_INSCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateCandidatWithPatch() throws Exception {
        // Initialize the database
        candidatRepository.saveAndFlush(candidat);

        int databaseSizeBeforeUpdate = candidatRepository.findAll().size();

        // Update the candidat using partial update
        Candidat partialUpdatedCandidat = new Candidat();
        partialUpdatedCandidat.setId(candidat.getId());

        partialUpdatedCandidat
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .tel(UPDATED_TEL)
            .numeroInscription(UPDATED_NUMERO_INSCRIPTION);

        restCandidatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCandidat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCandidat))
            )
            .andExpect(status().isOk());

        // Validate the Candidat in the database
        List<Candidat> candidatList = candidatRepository.findAll();
        assertThat(candidatList).hasSize(databaseSizeBeforeUpdate);
        Candidat testCandidat = candidatList.get(candidatList.size() - 1);
        assertThat(testCandidat.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testCandidat.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testCandidat.getDateNaissance()).isEqualTo(UPDATED_DATE_NAISSANCE);
        assertThat(testCandidat.getTel()).isEqualTo(UPDATED_TEL);
        assertThat(testCandidat.getNumeroInscription()).isEqualTo(UPDATED_NUMERO_INSCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingCandidat() throws Exception {
        int databaseSizeBeforeUpdate = candidatRepository.findAll().size();
        candidat.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCandidatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, candidat.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(candidat))
            )
            .andExpect(status().isBadRequest());

        // Validate the Candidat in the database
        List<Candidat> candidatList = candidatRepository.findAll();
        assertThat(candidatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCandidat() throws Exception {
        int databaseSizeBeforeUpdate = candidatRepository.findAll().size();
        candidat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCandidatMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(candidat))
            )
            .andExpect(status().isBadRequest());

        // Validate the Candidat in the database
        List<Candidat> candidatList = candidatRepository.findAll();
        assertThat(candidatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCandidat() throws Exception {
        int databaseSizeBeforeUpdate = candidatRepository.findAll().size();
        candidat.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCandidatMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(candidat)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Candidat in the database
        List<Candidat> candidatList = candidatRepository.findAll();
        assertThat(candidatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCandidat() throws Exception {
        // Initialize the database
        candidatRepository.saveAndFlush(candidat);

        int databaseSizeBeforeDelete = candidatRepository.findAll().size();

        // Delete the candidat
        restCandidatMockMvc
            .perform(delete(ENTITY_API_URL_ID, candidat.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Candidat> candidatList = candidatRepository.findAll();
        assertThat(candidatList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
