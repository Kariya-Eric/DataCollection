import waves from "./waves"; // Waves directive
import permission from "./permission";

const directives = { waves, permission };

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      const directive = directives[key];
      Vue.directive(directive.name, directive.directive);
    });
  },
};
