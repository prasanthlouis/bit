import chai, { expect } from 'chai';
import Helper from '../../src/e2e-helper/e2e-helper';

chai.use(require('chai-fs'));

describe('Jest Tester', function () {
  this.timeout(0);
  let helper: Helper;
  before(() => {
    helper = new Helper();
  });
  after(() => {
    helper.scopeHelper.destroy();
  });
  describe('component without any test file', () => {
    before(() => {
      helper.scopeHelper.reInitLocalScopeHarmony();
      helper.fixtures.populateComponents(1);
    });
    it('bit test should not throw any error', () => {
      expect(() => helper.command.test()).not.to.throw();
    });
    it('bit test should indicate that no tests found', () => {
      const output = helper.command.test();
      expect(output).to.have.string('no tests found');
    });
    it('bit build should not fail', () => {
      expect(() => helper.command.build()).not.to.throw();
    });
  });
  describe('component with a passing test', () => {
    before(() => {
      helper.scopeHelper.reInitLocalScopeHarmony();
      helper.fixtures.populateComponents(1);
      helper.fs.outputFile('comp1/comp1.spec.ts', specFilePassingFixture());
    });
    it('bit test should show the passing component via Jest output', () => {
      const output = helper.command.test('', true);
      expect(output).to.have.string('✓ should pass');
    });
    it('bit build should show the passing component via Jest output', () => {
      const output = helper.command.build('', true);
      expect(output).to.have.string('✓ should pass');
    });
  });
  describe('component with a failing test', () => {
    before(() => {
      helper.scopeHelper.reInitLocalScopeHarmony();
      helper.fixtures.populateComponents(1);
      helper.fs.outputFile('comp1/comp1.spec.ts', specFileFailingFixture());
    });
    it('bit test should exit with non-zero code', () => {
      expect(() => helper.command.test()).to.throw();
    });
    it('bit test should show the failing component via Jest output', () => {
      const output = helper.general.runWithTryCatch('bit test');
      expect(output).to.have.string('✕ should fail');
    });
    it('bit build should show the failing component via Jest output', () => {
      const output = helper.general.runWithTryCatch('bit build');
      expect(output).to.have.string('✕ should fail');
    });
  });
  describe('component with an errored test', () => {
    before(() => {
      helper.scopeHelper.reInitLocalScopeHarmony();
      helper.fixtures.populateComponents(1);
      helper.fs.outputFile('comp1/comp1.spec.ts', specFileErroringFixture());
    });
    it('bit test should exit with non-zero code', () => {
      expect(() => helper.command.test()).to.throw();
    });
    it('bit test should show the error', () => {
      const output = helper.general.runWithTryCatch('bit test');
      expect(output).to.have.string('SomeError');
      expect(output).to.have.string('1 failed');
    });
    it('bit build should show the error', () => {
      const output = helper.general.runWithTryCatch('bit build');
      expect(output).to.have.string('SomeError');
    });
  });
  describe('env with an incorrect Jest config', () => {
    before(() => {
      helper.scopeHelper.reInitLocalScopeHarmony();
      helper.fixtures.populateComponents(1);
      helper.fs.outputFile('comp1/comp1.spec.ts', specFilePassingFixture());
      helper.env.setCustomEnv('custom-react-env');
      helper.fs.outputFile('custom-react-env/jest/jest.config.js', invalidJestConfigFixture());
      helper.command.compile();
      helper.command.install();
      helper.command.setEnv('comp1', 'custom-react-env');
    });
    it('bit test should exit with non-zero code', () => {
      expect(() => helper.command.test()).to.throw();
    });
    it('bit test should show the error', () => {
      const output = helper.general.runWithTryCatch('bit test');
      expect(output).to.have.string('someUndefinedFunc is not defined');
    });
    it('bit build should show the error', () => {
      const output = helper.general.runWithTryCatch('bit build');
      expect(output).to.have.string('someUndefinedFunc is not defined');
    });
  });
});

function specFilePassingFixture() {
  return `describe('test', () => {
  it('should pass', () => {
    expect(true).toBeTruthy();
  });
});
`;
}

function specFileFailingFixture() {
  return `describe('test', () => {
  it('should fail', () => {
    expect(false).toBeTruthy();
  });
});
`;
}

function specFileErroringFixture() {
  return `describe('test', () => {
    throw new Error('SomeError');
  it('should not reach here', () => {
    expect(true).toBeTruthy();
  });
});
`;
}

function invalidJestConfigFixture() {
  return `module.exports = {
    transformIgnorePatterns: [
      someUndefinedFunc(),
    ],
  };
  `;
}
