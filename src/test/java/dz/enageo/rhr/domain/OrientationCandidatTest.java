package dz.enageo.rhr.domain;

import static org.assertj.core.api.Assertions.assertThat;

import dz.enageo.rhr.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrientationCandidatTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrientationCandidat.class);
        OrientationCandidat orientationCandidat1 = new OrientationCandidat();
        orientationCandidat1.setId(1L);
        OrientationCandidat orientationCandidat2 = new OrientationCandidat();
        orientationCandidat2.setId(orientationCandidat1.getId());
        assertThat(orientationCandidat1).isEqualTo(orientationCandidat2);
        orientationCandidat2.setId(2L);
        assertThat(orientationCandidat1).isNotEqualTo(orientationCandidat2);
        orientationCandidat1.setId(null);
        assertThat(orientationCandidat1).isNotEqualTo(orientationCandidat2);
    }
}
