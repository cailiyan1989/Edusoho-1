webpackJsonp(["app/js/auth/register/index"],{0:function(e,a){e.exports=jQuery},"6386db75dd507093b6de":function(e,a,t){"use strict";var i=t("9ffde76f31e1d8ca79f0");new(function(e){return e&&e.__esModule?e:{default:e}}(i).default)},"9ffde76f31e1d8ca79f0":function(e,a,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(a,"__esModule",{value:!0});var s=t("7ab4a89ebadbfdecc2bf"),n=i(s),r=t("4602c3f5fe7ad9e3e91d"),d=i(r),l=t("0282bb17fb83bfbfed9b"),o=i(l),u=t("bbc0ef257199acca9fed"),m=i(u),c=function(){function e(){(0,n.default)(this,e),this.drag=$("#drag-btn").length?new m.default($("#drag-btn"),$(".js-jigsaw"),{limitType:"web_register"}):null,this.dragEvent(),this.initValidator(),this.inEventMobile(),this.initMobileMsgVeriCodeSendBtn(),this.initFieldVisitId()}return(0,d.default)(e,[{key:"dragEvent",value:function(){var e=this;this.drag&&this.drag.on("success",function(a){e._smsBtnable()})}},{key:"initValidator",value:function(){var e=this;$("#register-form").validate(this._validataRules()),$.validator.addMethod("email_or_mobile_check",function(a,t,i){var s=/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,n=/^1\d{10}$/,r=!1,d=s.test(a),l=n.test(a);return l?($(".email_mobile_msg").removeClass("hidden"),e.captchEnable||$(".js-drag-jigsaw").addClass("hidden")):($(".email_mobile_msg").addClass("hidden"),$(".js-drag-jigsaw").removeClass("hidden")),(d||l)&&(r=!0),$.validator.messages.email_or_mobile_check=Translator.trans("validate.mobile_or_email_message"),this.optional(t)||r},Translator.trans("validate.email_or_mobile_check.message"))}},{key:"inEventMobile",value:function(){var e=this;$("#register_emailOrMobile").blur(function(){var a=$("#register_emailOrMobile").val();e.emSmsCodeValidate(a)}),$("#register_mobile").blur(function(){var a=$("#register_mobile").val();e.emSmsCodeValidate(a)})}},{key:"initDragCaptchaCodeRule",value:function(){$(".js-drag-img").length&&$('[name="dragCaptchaToken"]').rules("add",{required:!0,messages:{required:Translator.trans("auth.register.drag_captcha_tips")}})}},{key:"_smsBtnDisable",value:function(){$(".js-sms-send-btn").addClass("disabled").attr("disabled",!0)}},{key:"_smsBtnable",value:function(){$(".js-sms-send-btn").removeClass("disabled").attr("disabled",!1)}},{key:"initSmsCodeRule",value:function(){$('[name="sms_code"]').rules("add",{required:!0,unsigned_integer:!0,rangelength:[6,6],es_remote:{type:"get"},messages:{rangelength:Translator.trans("validate.sms_code.message")}})}},{key:"initMobileMsgVeriCodeSendBtn",value:function(){var e=$(".js-sms-send-btn"),a=this;e.click(function(){a._smsBtnDisable();var t=$("[name='verifiedMobile']").length?"verifiedMobile":"emailOrMobile";new o.default({element:e,url:$(this).data("smsUrl"),smsType:"sms_registration",dataTo:t,captcha:!0,captchaValidated:!0,captchaNum:"dragCaptchaToken",preSmsSend:function(){return!0},error:function(e){a.drag.initDragCaptcha()},additionalAction:function(t){return"captchaRequired"==t&&(e.attr("disabled",!0),$(".js-drag-jigsaw").removeClass("hidden"),a.captchEnable=!0,a.drag&&a.drag.initDragCaptcha(),!0)}})})}},{key:"_validataRules",value:function(){var e=this;return{rules:{nickname:{required:!0,byte_minlength:4,byte_maxlength:18,nickname:!0,chinese_alphanumeric:!0,es_remote:{type:"get"}},password:{minlength:5,maxlength:20},email:{required:!0,email:!0,es_remote:{type:"get"}},invitedCode:{required:!1,reg_inviteCode:!0,es_remote:{type:"get"}},emailOrMobile:{required:!0,email_or_mobile_check:!0,es_remote:{type:"get",callback:function(a){a?e._smsBtnable():e._smsBtnDisable()}}},verifiedMobile:{required:!0,phone:!0,es_remote:{type:"get",callback:function(a){a?e._smsBtnable():e._smsBtnDisable()}}},dragCaptchaToken:{required:!0}},messages:{verifiedMobile:{required:Translator.trans("validate.phone.message")},emailOrMobile:{required:Translator.trans("validate.phone_and_email_input.message")},email:{required:Translator.trans("validate.valid_email_input.message")},dragCaptchaToken:{required:Translator.trans("auth.register.drag_captcha_tips")}}}}},{key:"emSmsCodeValidate",value:function(e){/^1\d{10}$/.test(e)?(this.initSmsCodeRule(),$('[name="dragCaptchaToken"]').rules("remove")):(this.initDragCaptchaCodeRule(),$('[name="sms_code"]').rules("remove"))}},{key:"initFieldVisitId",value:function(){$(document).ready(function(){"undefined"!==window._VISITOR_ID&&$('[name="registerVisitId"]').val(window._VISITOR_ID)})}}]),e}();a.default=c}},["6386db75dd507093b6de"]);