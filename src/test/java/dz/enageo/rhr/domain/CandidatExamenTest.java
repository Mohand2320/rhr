package dz.enageo.rhr.domain;

import static org.assertj.core.api.Assertions.assertThat;

import dz.enageo.rhr.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CandidatExamenTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CandidatExamen.class);
        CandidatExamen candidatExamen1 = new CandidatExamen();
        candidatExamen1.setId(1L);
        CandidatExamen candidatExamen2 = new CandidatExamen();
        candidatExamen2.setId(candidatExamen1.getId());
        assertThat(candidatExamen1).isEqualTo(candidatExamen2);
        candidatExamen2.setId(2L);
        assertThat(candidatExamen1).isNotEqualTo(candidatExamen2);
        candidatExamen1.setId(null);
        assertThat(candidatExamen1).isNotEqualTo(candidatExamen2);
    }
}
