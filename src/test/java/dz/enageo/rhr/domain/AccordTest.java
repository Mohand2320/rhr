package dz.enageo.rhr.domain;

import static org.assertj.core.api.Assertions.assertThat;

import dz.enageo.rhr.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AccordTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Accord.class);
        Accord accord1 = new Accord();
        accord1.setId(1L);
        Accord accord2 = new Accord();
        accord2.setId(accord1.getId());
        assertThat(accord1).isEqualTo(accord2);
        accord2.setId(2L);
        assertThat(accord1).isNotEqualTo(accord2);
        accord1.setId(null);
        assertThat(accord1).isNotEqualTo(accord2);
    }
}
