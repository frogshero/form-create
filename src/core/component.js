import formCreate from './formCreate';
import baseComponent from './mixins';
import {$nt} from "./util";

const formCreateName = 'FormCreate';

/**
 * $FormCreate封装了FormCreate，混入了mixins
 * coreComponent也混入了mixins
 */
const $FormCreate = () => ({
    name: formCreateName,
    //$FormCreate的一些公共操作封装到了mixins.js
    mixins: [baseComponent],
    props: {
        rule: {
            type: Array,
            required: true,
            default: () => {
                return {}
            }
        },
        option: {
            type: Object,
            default: () => {
                return {}
            },
            required: false
        },
        //在index.html里v-model绑定fApi，默认value的属性
        value: Object
    },
    render() {
        return this._fComponent.render();
    },
    beforeCreate() {
        const {rule, option} = this.$options.propsData;
        //$FormCreate封装了
        const _fc = new formCreate(rule, option);

        this._fComponent = _fc;
        _fc._type = 'rule';
        _fc.beforeBoot(this);
    },
    created() {
        const _fc = this._fComponent;

        _fc.boot();
        this.$f = _fc.fCreateApi;

        //这里更新v-model="fApi"的值
        this.$emit('input', _fc.fCreateApi);
    },
    mounted() {
        const _fc = this._fComponent;

        _fc.mounted(this);

        this.$watch('rule', n => {
            _fc.reload(n);
            this.$emit('input', this.$f);
        });
        this.$watch('option', n => {
            $nt(() => {
                this._sync();
            });
        }, {deep: true});

        this.__init();
        this.$emit('input', this.$f);
    }
});

export {
    $FormCreate,
    formCreateName
};
