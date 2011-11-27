<?php
/**
 * Project model class.
 *
 * This software is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License version 3 as published by the Free Software Foundation
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * @category   PHProjekt
 * @package    Application
 * @subpackage Project
 * @copyright  Copyright (c) 2010 Mayflower GmbH (http://www.mayflower.de)
 * @license    LGPL v3 (See LICENSE file)
 * @link       http://www.phprojekt.com
 * @since      File available since Release 6.0
 * @version    Release: @package_version@
 * @author     Gustavo Solt <solt@mayflower.de>
 */

/**
 * Project model class.
 *
 * The class of each model return the data for show
 * on the list and the form view.
 *
 * @category   PHProjekt
 * @package    Application
 * @subpackage Project
 * @copyright  Copyright (c) 2010 Mayflower GmbH (http://www.mayflower.de)
 * @license    LGPL v3 (See LICENSE file)
 * @link       http://www.phprojekt.com
 * @since      File available since Release 6.0
 * @version    Release: @package_version@
 * @author     Gustavo Solt <solt@mayflower.de>
 */
class Project_Models_Project extends Phprojekt_Item_Abstract
{
    public $hasMany = array('modulePermissions' => array('classname' => 'Project_Models_ProjectModulePermissions'));

    /**
     * Validate function for the projectId field.
     *
     * @param integer $value Value of the projectId to check.
     *
     * @return string Error msg.
     */
    public function validateProjectId($value)
    {
        if (null !== $this->id && $this->id > 0) {
            $node = new Project_Models_Project();
            $node = $node->find($this->id);
            $tree = new Phprojekt_Tree_Node_Database($node, $this->id);
            if ($tree->setup()->getActiveRecord()->id == $value) {
                return Phprojekt::getInstance()->translate('The project can not be saved under itself');
            } else if ($this->_isInTheProject($value, $tree)) {
                return Phprojekt::getInstance()->translate('The project can not be saved under its children');
            }
        }

        return null;
    }

    /**
     * Check if the projectId is under the same project or a subproject of him.
     *
     * @param integer                      $projectId The projectId to check.
     * @param Phprojekt_Tree_Node_Database $node      The node of the current project.
     *
     * @return boolean False if not.
     */
    private function _isInTheProject($projectId, $node)
    {
        $allow = false;
        if ($node->hasChildren()) {
            $childrens = $node->getChildren();
            foreach ($childrens as $childrenNode) {
                if ($projectId == $childrenNode->id) {
                    $allow = true;
                    break;
                } else {
                    if ($this->_isInTheProject($projectId, $childrenNode)) {
                        $allow = true;
                        break;
                    }
                }
            }
        }

        return $allow;
    }

    /**
     * Save the allow modules for one projectId.
     * First delete all the older relations
     *
     * @param array $rights Array with the modules to save.
     *
     * @return void
     */
    public function saveModules($rights)
    {
        foreach ($this->modulePermissions->fetchAll() as $relation) {
            $relation->delete();
        }
        foreach ($rights as $moduleId) {
            $modulePermissions = $this->modulePermissions->create();
            $modulePermissions->moduleId  = $moduleId;
            $modulePermissions->projectId = $this->id;
            $modulePermissions->save();
        }
    }

    /**
     * Add a new relation module-project without delete any entry.
     * Used for add modules to the root project.
     *
     * @param integer $moduleId The Module Id to add.
     *
     * @return void
     */
    public function addModule($moduleId)
    {
        $modulePermissions = $this->modulePermissions->create();
        $modulePermissions->moduleId = $moduleId;
        $modulePermissions->projectId = $this->id;
        $modulePermissions->save();
    }

    /**
     * Delete the tree cache after save.
     *
     * @return boolean True for a sucessful save.
     */
    public function parentSave()
    {
        $result = parent::parentSave();
        Phprojekt_Tree_Node_Database::deleteCache();

        return $result;
    }

    /**
     * Delete the tree cache after save.
     *
     * @return boolean True for a sucessful save.
     */
    public function save()
    {
        $result = parent::save();
        Phprojekt_Tree_Node_Database::deleteCache();

        return $result;
    }

    /**
     * Delete the tree cache after delete.
     *
     * @return void
     */
    public function delete()
    {
        parent::delete();
        Phprojekt_Tree_Node_Database::deleteCache();
    }

    /**
     * Save the rights for the current item.
     *
     * The users are a POST array with user IDs.
     *
     * @param array $rights Array of user IDs with the bitmask access.
     *
     * @return void
     */
    public function saveRights($rights)
    {
        // Do the default action
        parent::saveRights($rights);
    }

    /**
     * Validate the data of the current record.
     *
     * @return boolean True for valid.
     */
    public function recordValidate()
    {
        if (!$this->_validate->validateDateRange($this->startDate, $this->endDate)) {
            return false;
        } else {
            return parent::recordValidate();
        }
    }

    /**
     * Returns the tree node for this project.
     *
     * The node allows navigating to subprojects and other operations on the project tree.
     *
     * @return Phprojekt_Tree_Node_Database A Tree node belonging to this project.
     */
    public function getTree()
    {
        $tree = new Phprojekt_Tree_Node_Database($this);
        $tree->setup();
        return $tree;
    }
}
