package dz.enageo.rhr.domain;

import static org.assertj.core.api.Assertions.assertThat;

import dz.enageo.rhr.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StructureTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Structure.class);
        Structure structure1 = new Structure();
        structure1.setId(1L);
        Structure structure2 = new Structure();
        structure2.setId(structure1.getId());
        assertThat(structure1).isEqualTo(structure2);
        structure2.setId(2L);
        assertThat(structure1).isNotEqualTo(structure2);
        structure1.setId(null);
        assertThat(structure1).isNotEqualTo(structure2);
    }
}
