import { $t } from "@/hooks/useLang";
import { FORM_EDIT, FORM_VIEW } from "../core/action";


export default {
    test_step: {
        test_option: {
            form_edit: FORM_EDIT({
                options: {
                    labelCol: {span: 5}
                },
                items: [
                    {
                        label: $t('role.role-name'),
                        field: "name",
                        required: true
                    },
                    {
                        label: $t('role.role-name'),
                        field: "display_name",
                        required: true
                    },
                    {
                        label: $t('role.role-summary'),
                        field: "description",
                    }
                ]
            }),
            form_view: FORM_VIEW({
                options: {
                    labelCol: {span: 5}
                },
                items: [
                    {
                        label: $t('role.role-name'),
                        field: "name",
                        required: true
                    },
                    {
                        label: $t('role.role-name'),
                        field: "display_name",
                        required: true
                    },
                    {
                        label: $t('role.role-summary'),
                        field: "description",
                    }
                ]
            })
        }
    }
}