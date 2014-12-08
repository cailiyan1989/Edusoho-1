<?php 
namespace Topxia\AdminBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Topxia\Common\Paginator;
use Topxia\Common\ArrayToolkit;

class ArticleMaterialController extends BaseController
{
    public function manageAction(Request $request, $categoryId)
    {
        $conditions = $request->query->all();
        $conditions['categoryId'] = $categoryId;
        if (empty($conditions)) {
            $conditions = array('categoryId' => $categoryId);
        }

        if (!empty($conditions['keyword'])) {
            $conditions['title'] = $conditions['keyword'];
        }

        if (!empty($conditions['tagIds'])) {
            $conditions['tagIds'] = explode(',', $conditions['tagIds']);
            $tags = $this->getTagService()->findTagsByIds($conditions['tagIds']);
        } else {
            $tags = array();
        }

        if (!empty($conditions['knowledgeIds'])) {
            $conditions['knowledgeIds'] = explode(',', $conditions['knowledgeIds']);
            $searchknowledges = $this->getKnowledgeService()->findKnowledgeByIds($conditions['knowledgeIds']);
        } else {
            $searchknowledges = array();
        }

        $articleMaterialsCount = $this->getArticleMaterialService()->searchArticleMaterialsCount($conditions);

        $paginator = new Paginator($this->get('request'), $articleMaterialsCount, 8);

        $articleMaterials = $this->getArticleMaterialService()->searchArticleMaterials(
            $conditions, 
            array('createdTime','desc'),
            $paginator->getOffsetCount(),  
            $paginator->getPerPageCount()
        );
        $category = $this->getCategoryService()->getCategory($categoryId);

        $knowledges = $this->getKnowledgeService()->findKnowledgeByIds(ArrayToolkit::column($articleMaterials,'mainKnowledgeId'));
        $knowledges = ArrayToolkit::index($knowledges, 'id');

        return $this->render('TopxiaAdminBundle:ArticleMaterial:manage.html.twig',array(
            'category' => $category,
            'articleMaterials' => $articleMaterials,
            'paginator' => $paginator,
            'knowledges' => $knowledges,
            'searchknowledges' => $searchknowledges,
            'articleMaterialsCount' => $articleMaterialsCount,
            'tags' => $tags
        ));
    }

    public function createAction(Request $request, $categoryId)
    {
        $category = $this->getCategoryService()->getCategory($categoryId);
        if (empty($category)) {
            throw $this->createNotFoundException("分类(#{$categoryId})不存在，创建文章素材失败！");
        }

        if ($request->getMethod() == 'POST') {
            $articleMaterial = $request->request->all();
            if (empty($articleMaterial['mainKnowledgeId'])){
                return $this->createJsonResponse(array('error' => true,'message'=>'主知识点不能为空'));
            }
            if (empty($articleMaterial['tagIds'])){
                return $this->createJsonResponse(array('error' => true,'message'=>'标签不能为空'));
            }

            $articleMaterial = $this->filterArticleMaterial($articleMaterial);
            $articleMaterial['categoryId'] = $categoryId;
            $articleMaterial = $this->getArticleMaterialService()->createArticleMaterial($articleMaterial);

            return $this->redirect($this->generateUrl('admin_article_material_manage',array('categoryId'=>$categoryId)));
        }

        return $this->render('TopxiaAdminBundle:ArticleMaterial:modal.html.twig',array(
            'category' => $category
        ));
    }

    public function deleteAction(Request $request)
    {
        $ids = $request->request->get('ids', array());
        $id = $request->query->get('id', null);

        if ($id) {
            array_push($ids, $id);
        }
        $result = $this->getArticleMaterialService()->deleteArticleMaterialsByIds($ids);

        if($result){
            return $this->createJsonResponse(array("status" =>"success"));
        } else {
            return $this->createJsonResponse(array("status" =>"failed"));
        }
    }

    public function editAction(Request $request, $categoryId, $id)
    {
        $category = $this->getCategoryService()->getCategory($categoryId);
        if (empty($category)) {
            throw $this->createNotFoundException("分类(#{$categoryId})不存在，编辑文章素材失败！");
        }

        $articleMaterial = $this->getArticleMaterialService()->getArticleMaterial($id);
        if (empty($articleMaterial)) {
            throw $this->createNotFoundException('文章素材已经删除或者不存在.');
        }

        if (!empty($articleMaterial['relatedKnowledgeIds'])) {
            $articleMaterial['relatedKnowledgeIds'] = implode(",", $articleMaterial['relatedKnowledgeIds']);
        }

        $articleMaterial['tagIds'] = implode(",", $articleMaterial['tagIds']);

        if ($request->getMethod() == 'POST') {
            $articleMaterial = $request->request->all();
            if (empty($articleMaterial['mainKnowledgeId'])){
                return $this->createJsonResponse(array('error' => true,'message'=>'主知识点不能为空'));
            }
            if (empty($articleMaterial['tagIds'])){
                return $this->createJsonResponse(array('error' => true,'message'=>'标签不能为空'));
            }

            $articleMaterial = $this->filterArticleMaterial($articleMaterial);
            $articleMaterial = $this->getArticleMaterialService()->updateArticleMaterial($id,$articleMaterial);

            return $this->redirect($this->generateUrl('admin_article_material_manage',array('categoryId'=>$categoryId)));
        }
        return $this->render('TopxiaAdminBundle:ArticleMaterial:modal.html.twig',
            array(
                'articleMaterial' => $articleMaterial,
                'category' => $category,
            )
        );
    }

    public function previewAction(Request $request, $categoryId, $id)
    {
        $category = $this->getCategoryService()->getCategory($categoryId);
        if (empty($category)) {
            throw $this->createNotFoundException("分类(#{$categoryId})不存在，预览文章素材失败！");
        }

        $articleMaterial = $this->getArticleMaterialService()->getArticleMaterial($id);
        if (empty($articleMaterial)) {
            throw $this->createNotFoundException('文章素材已经删除或者不存在.');
        }
        $mainKnowledge = $this->getKnowledgeService()->getKnowledge($articleMaterial['mainKnowledgeId']);
        $relatedKnowledges = array();
        foreach ($articleMaterial['relatedKnowledgeIds'] as $relatedKnowledgeId) {
            $relatedKnowledges[] = $this->getKnowledgeService()->getKnowledge($relatedKnowledgeId);
        }

        $tags = array();
        foreach ($articleMaterial['tagIds'] as $tagId) {
            $tags[] = $this->getTagService()->getTag($tagId);
        }

        return $this->render('TopxiaAdminBundle:ArticleMaterial:preview.html.twig',array(
            'articleMaterial' => $articleMaterial,
            'mainKnowledge' => $mainKnowledge,
            'relatedKnowledges' => $relatedKnowledges,
            'tags' => $tags
        ));
    }

    private function filterArticleMaterial($articleMaterial)
    {
        $articleMaterial['knowledgeIds'] = $articleMaterial['mainKnowledgeId'];
        if (!empty($articleMaterial['relatedKnowledgeIds'])){
            $articleMaterial['knowledgeIds'] = $articleMaterial['relatedKnowledgeIds'].",".$articleMaterial['mainKnowledgeId'];
            $articleMaterial['relatedKnowledgeIds'] = array_filter(explode(',', $articleMaterial['relatedKnowledgeIds']));
        }
        $articleMaterial['knowledgeIds'] = array_filter(explode(',', $articleMaterial['knowledgeIds']));
        $articleMaterial['tagIds'] = array_filter(explode(',', $articleMaterial['tagIds']));

        return $articleMaterial;
    }

    private function getArticleMaterialService()
    {
        return $this->getServiceKernel()->createService('ArticleMaterial.ArticleMaterialService');
    }

    private function getCategoryService()
    {
        return $this->getServiceKernel()->createService('Taxonomy.CategoryService');
    }

    private function getKnowledgeService()
    {
        return $this->getServiceKernel()->createService('Taxonomy.KnowledgeService');
    }

    private function getTagService()
    {
        return $this->getServiceKernel()->createService('Tag.TagService');
    }
}